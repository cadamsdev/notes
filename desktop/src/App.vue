<script setup lang="ts">
import './styles/global.css';
import { ref, computed, onMounted } from 'vue';
import Database from '@tauri-apps/plugin-sql';
import { marked } from 'marked';
import Fuse from 'fuse.js';
import CalendarView from './components/CalendarView.vue';
import TagsPanel from './components/TagsPanel.vue';
import NoteCreator from './components/NoteCreator.vue';
import NoteItem from './components/NoteItem.vue';
import EmptyState from './components/EmptyState.vue';
import SearchBar from './components/SearchBar.vue';

// Configure marked options
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
});

interface Note {
  id: number;
  content: string;
  createdAt: Date;
}

const notes = ref<Note[]>([]);
const selectedDate = ref<Date | null>(null);
const selectedTag = ref<string | null>(null);
const currentMonth = ref(new Date());
const searchQuery = ref<string>('');
let db: any = null;

// Initialize database and load notes
onMounted(async () => {
  try {
    console.log('Initializing database...');
    db = await Database.load('sqlite:notes.db');
    console.log('Database loaded:', db);
    
    // Create table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
    console.log('Table created/verified');
    
    await loadNotes();
    console.log('Notes loaded, count:', notes.value.length);
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
});

const loadNotes = async () => {
  try {
    const result: Array<{ id: number; content: string; created_at: string }> = await db.select(
      'SELECT id, content, created_at FROM notes ORDER BY created_at DESC'
    );
    
    notes.value = result.map((note: { id: number; content: string; created_at: string }) => ({
      id: note.id,
      content: note.content,
      createdAt: new Date(note.created_at)
    }));
  } catch (error) {
    console.error('Failed to load notes:', error);
  }
};

// Extract tags from note content (words starting with #)
const extractTags = (content: string): string[] => {
  const tagRegex = /#(\w+)/g;
  const matches = content.matchAll(tagRegex);
  return Array.from(matches, m => m[1].toLowerCase());
};

// Fuse.js configuration for fuzzy search
const fuseOptions = {
  keys: ['content'],
  threshold: 0.4, // 0.0 = exact match, 1.0 = match anything
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
};

const filteredNotes = computed(() => {
  let filtered = notes.value;
  
  // Filter by search query using Fuse.js fuzzy search
  if (searchQuery.value.trim()) {
    const fuse = new Fuse(filtered, fuseOptions);
    const results = fuse.search(searchQuery.value);
    filtered = results.map(result => result.item);
  }
  
  // Filter by date
  if (selectedDate.value) {
    filtered = filtered.filter(note => {
      const noteDate = new Date(note.createdAt);
      return noteDate.toDateString() === selectedDate.value!.toDateString();
    });
  }
  
  // Filter by tag
  if (selectedTag.value) {
    filtered = filtered.filter(note => {
      const tags = extractTags(note.content);
      return tags.includes(selectedTag.value!);
    });
  }
  
  return filtered;
});

const createNote = async (content: string) => {
  try {
    if (!db) {
      console.error('Database not initialized');
      return;
    }
    
    const now = new Date().toISOString();
    
    console.log('Creating note with content:', content);
    
    const result = await db.execute(
      'INSERT INTO notes (content, created_at) VALUES ($1, $2)',
      [content, now]
    );
    
    console.log('Insert result:', result);
    
    // Add to local array
    notes.value.unshift({
      id: result.lastInsertId,
      content,
      createdAt: new Date(now)
    });
    
    console.log('Note created successfully');
  } catch (error) {
    console.error('Failed to create note:', error);
  }
};

const deleteNote = async (id: number) => {
  try {
    await db.execute('DELETE FROM notes WHERE id = $1', [id]);
    notes.value = notes.value.filter(note => note.id !== id);
  } catch (error) {
    console.error('Failed to delete note:', error);
  }
};

const editNote = async (id: number, content: string) => {
  try {
    await db.execute(
      'UPDATE notes SET content = $1 WHERE id = $2',
      [content, id]
    );
    
    const note = notes.value.find(n => n.id === id);
    if (note) {
      note.content = content;
    }
  } catch (error) {
    console.error('Failed to update note:', error);
  }
};
</script>

<template>
  <main class="min-h-screen flex justify-center bg-[var(--color-x-black)]">
    <!-- Main Container - 2 Column Layout -->
    <div class="w-full max-w-[1200px] flex border-x border-[var(--color-x-border)]">
      
      <!-- Left Column - Calendar and Tags (Sticky) -->
      <div class="w-[400px] border-r border-[var(--color-x-border)] flex flex-col sticky top-0 h-screen overflow-y-auto">
        <CalendarView
          :notes="notes"
          :selected-date="selectedDate"
          :current-month="currentMonth"
          @update:selected-date="selectedDate = $event"
          @update:current-month="currentMonth = $event"
        />
        
        <TagsPanel
          :notes="notes"
          :selected-tag="selectedTag"
          @update:selected-tag="selectedTag = $event"
        />
      </div>

      <!-- Right Column - Notes Feed -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <header class="sticky top-0 bg-[var(--color-x-black)]/95 backdrop-blur-xl border-b border-[var(--color-x-border)] z-10 shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
          <div class="px-4 py-4">
            <h1 class="text-xl font-bold tracking-tight">My Notes</h1>
          </div>
        </header>

        <!-- Search Bar -->
        <div class="sticky top-[60px] z-10 bg-[var(--color-x-black)]">
          <SearchBar @update:search-query="searchQuery = $event" />
        </div>

        <!-- Note Creator -->
        <NoteCreator @create="createNote" />

        <!-- Notes Feed -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="filteredNotes.length > 0" class="divide-y divide-[var(--color-x-border)]">
            <NoteItem
              v-for="note in filteredNotes"
              :key="note.id"
              :note="note"
              @delete="deleteNote"
              @edit="editNote"
            />
          </div>

          <!-- Empty State -->
          <EmptyState v-else :has-date-filter="!!selectedDate" />
        </div>
      </div>
    </div>
  </main>
</template>

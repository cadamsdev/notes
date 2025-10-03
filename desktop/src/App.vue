<script setup lang="ts">
import './styles/global.css';
import { ref, computed, onMounted, onUnmounted } from 'vue';
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
const headerVisible = ref(true);
const lastScrollY = ref(0);
const scrollContainer = ref<HTMLElement | null>(null);
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

  // Set up scroll listener
  const container = document.querySelector('.notes-feed-container');
  if (container) {
    scrollContainer.value = container as HTMLElement;
    container.addEventListener('scroll', handleScroll);
  }
});

// Clean up scroll listener
onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll);
  }
});

// Handle scroll to show/hide header
const handleScroll = () => {
  if (!scrollContainer.value) return;
  
  const currentScrollY = scrollContainer.value.scrollTop;
  
  // Header is only sticky/visible when at the very top
  if (currentScrollY === 0) {
    headerVisible.value = true;
  } else {
    headerVisible.value = false;
  }
  
  lastScrollY.value = currentScrollY;
};

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
  <main class="min-h-screen flex justify-center relative">
    <!-- Cosmic Background Overlay -->
    <div class="fixed inset-0 bg-gradient-to-b from-transparent via-[var(--color-x-dark)]/30 to-transparent pointer-events-none z-0"></div>
    
    <!-- Main Container - 2 Column Layout -->
    <div class="w-full max-w-[1200px] flex border-x border-[var(--color-x-border)] relative z-10 shadow-[0_0_50px_rgba(0,168,255,0.15)]">
      
      <!-- Left Column - Calendar and Tags (Sticky) -->
      <div class="w-[400px] border-r border-[var(--color-x-border)] flex flex-col sticky top-0 h-screen overflow-y-auto glass-panel">
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
      <div class="flex-1 flex flex-col glass-panel">
        <!-- Header -->
        <header 
          class="bg-gradient-to-r from-[var(--color-x-dark)]/95 to-[var(--color-x-darker)]/95 backdrop-blur-xl border-b border-[var(--color-x-border)] z-30 shadow-[0_4px_20px_rgba(0,168,255,0.2)] transition-all duration-500 ease-out"
          :class="{ 'opacity-0 -translate-y-full pointer-events-none': !headerVisible }"
        >
          <div class="px-6 py-5 relative">
            <div class="flex items-center gap-3">
              <!-- Rocket Icon -->
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-x-blue)] to-[var(--color-x-nebula-purple)] flex items-center justify-center shadow-lg shadow-[var(--color-x-blue)]/50 transition-transform duration-500">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-x-text-primary)] to-[var(--color-x-blue)] bg-clip-text text-transparent">
                  Cosmic Notes
                </h1>
                <p class="text-xs text-[var(--color-x-text-muted)]">Your thoughts, across the universe</p>
              </div>
            </div>
          </div>
        </header>

        <!-- Search Bar -->
        <div class="sticky top-0 z-40 transition-all duration-500 ease-out">
          <SearchBar @update:search-query="searchQuery = $event" />
        </div>

        <!-- Notes Feed -->
        <div class="flex-1 overflow-y-auto notes-feed-container">
          <!-- Note Creator -->
          <NoteCreator @create="createNote" />
          
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

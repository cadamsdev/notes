<script setup lang="ts">
import './styles/global.css';
import { ref, computed, onMounted } from 'vue';
import Database from '@tauri-apps/plugin-sql';
import { marked } from 'marked';
import Fuse from 'fuse.js';
import CustomTitleBar from './components/CustomTitleBar.vue';
import CalendarView from './components/CalendarView.vue';
import TagsPanel from './components/TagsPanel.vue';
import NoteCreator from './components/NoteCreator.vue';
import NoteItem from './components/NoteItem.vue';
import EmptyState from './components/EmptyState.vue';
import SearchBar from './components/SearchBar.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import SettingsPanel from './components/SettingsPanel.vue';

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

// Reference to settings panel
const settingsPanel = ref<InstanceType<typeof SettingsPanel> | null>(null);

const openSettings = () => {
  settingsPanel.value?.openSettings();
};

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
  <!-- Custom blurred background -->
  <div class="bg-[rgba(35,35,35,0.15)] absolute z-[-1]"></div>

  <!-- Custom Title Bar -->
  <CustomTitleBar />
  
  <main class="h-[calc(100vh-40px)] p-6 flex justify-center overflow-hidden">
    <!-- Main Container - Apple-style centered layout with generous spacing -->
    <div class="w-full max-w-[1400px] flex gap-6 h-full">
      
      <!-- Left Column - Search, Calendar and Tags (Glass Panel) -->
      <div class="w-[380px] flex flex-col h-full overflow-hidden">
        <div class="glass-panel flex flex-col h-full overflow-hidden">
          <!-- Search Bar -->
          <div class="px-6 py-5 border-b border-white/10">
            <SearchBar @update:search-query="searchQuery = $event" />
          </div>
          
          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto">
            <div class="px-4 py-2">
              <CalendarView
                :notes="notes"
                :selected-date="selectedDate"
                :current-month="currentMonth"
                @update:selected-date="selectedDate = $event"
                @update:current-month="currentMonth = $event"
              />
            </div>
            
            <div class="px-4 pb-4">
              <TagsPanel
                :notes="notes"
                :selected-tag="selectedTag"
                @update:selected-tag="selectedTag = $event"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Notes Feed -->
      <div class="flex-1 flex flex-col h-full overflow-hidden">
        <!-- Notes Feed - Scrollable Container -->
        <div class="flex-1 overflow-y-auto pr-2 notes-feed-container">
            <!-- Header -->
            <header class="glass-header rounded-2xl mb-6">
              <div class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-x-blue)] to-[var(--color-x-blue-hover)] flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h1 class="text-xl font-semibold text-[var(--color-x-text-primary)] tracking-tight">
                      Notes
                    </h1>
                    <p class="text-sm text-[var(--color-x-text-secondary)] mt-0.5">
                      {{ filteredNotes.length }} {{ filteredNotes.length === 1 ? 'note' : 'notes' }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <!-- Settings Button -->
                    <button
                      @click="openSettings"
                      class="w-9 h-9 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center text-[var(--color-x-text-secondary)] hover:text-[var(--color-x-text-primary)]"
                      title="Settings"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </button>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </header>
            
            <!-- Note Creator -->
            <div class="mb-6">
              <NoteCreator @create="createNote" />
            </div>
            
            <div v-if="filteredNotes.length > 0" class="space-y-4">
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

  <!-- Settings Panel -->
  <SettingsPanel ref="settingsPanel" />
</template>

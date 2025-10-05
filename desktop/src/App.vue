<script setup lang="ts">
import './styles/global.css';
import { ref, computed, onMounted, watch } from 'vue';
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
import NotesHeader from './components/NotesHeader.vue';

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
const selectedTags = ref<string[]>([]);
const currentMonth = ref(new Date());
const searchQuery = ref<string>('');
let db: any = null;

// Infinite scroll state
const NOTES_PER_PAGE = 20;
const displayedNotesCount = ref(NOTES_PER_PAGE);
const notesContainer = ref<HTMLElement | null>(null);

// Reference to settings panel
const settingsPanel = ref<InstanceType<typeof SettingsPanel> | null>(null);

// Get database filename based on environment
const getDbFilename = () => {
  const useTestDb = import.meta.env.VITE_USE_TEST_DB === 'true';
  const dbName = useTestDb ? 'notes_test.db' : 'notes.db';
  console.log('Frontend VITE_USE_TEST_DB:', import.meta.env.VITE_USE_TEST_DB);
  console.log('Frontend using database:', dbName);
  return dbName;
};

const openSettings = () => {
  settingsPanel.value?.openSettings();
};

// Initialize database and load notes
onMounted(async () => {
  try {
    const dbFilename = getDbFilename();
    console.log('Initializing database:', dbFilename);
    db = await Database.load(`sqlite:${dbFilename}`);
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
  
  // Filter by tags (AND logic - note must have ALL selected tags)
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(note => {
      const tags = extractTags(note.content);
      // Check if note has ALL selected tags
      return selectedTags.value.every(selectedTag => tags.includes(selectedTag));
    });
  }
  
  return filtered;
});

// Displayed notes with infinite scroll limit
const displayedNotes = computed(() => {
  return filteredNotes.value.slice(0, displayedNotesCount.value);
});

const hasMoreNotes = computed(() => {
  return displayedNotesCount.value < filteredNotes.value.length;
});

// Reset displayed count when filters change
watch([searchQuery, selectedDate, selectedTags], () => {
  displayedNotesCount.value = NOTES_PER_PAGE;
}, { deep: true });

// Infinite scroll handler
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const scrollPosition = target.scrollTop + target.clientHeight;
  const scrollHeight = target.scrollHeight;
  
  // Load more when user is within 200px of the bottom
  if (scrollHeight - scrollPosition < 200 && hasMoreNotes.value) {
    displayedNotesCount.value += NOTES_PER_PAGE;
  }
};

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
                :selected-tags="selectedTags"
                @update:selected-tags="selectedTags = $event"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Notes Feed -->
      <div class="flex-1 flex flex-col h-full overflow-hidden">
        <!-- Notes Feed - Scrollable Container -->
        <div 
          ref="notesContainer"
          class="flex-1 overflow-y-auto pr-2 notes-feed-container"
          @scroll="handleScroll"
        >
            <!-- Header -->
            <NotesHeader 
              :note-count="filteredNotes.length"
              @open-settings="openSettings"
            >
              <template #theme-toggle>
                <ThemeToggle />
              </template>
            </NotesHeader>
            
            <!-- Note Creator -->
            <div class="mb-6">
              <NoteCreator @create="createNote" />
            </div>
            
            <div v-if="filteredNotes.length > 0" class="space-y-4">
              <NoteItem
                v-for="note in displayedNotes"
                :key="note.id"
                :note="note"
                @delete="deleteNote"
                @edit="editNote"
              />
              
              <!-- Loading indicator when there are more notes -->
              <div v-if="hasMoreNotes" class="text-center py-4">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <svg class="w-4 h-4 animate-spin text-x-blue" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-sm text-x-text-secondary">
                    Loading more notes... ({{ displayedNotes.length }} of {{ filteredNotes.length }})
                  </span>
                </div>
              </div>
              
              <!-- End of list indicator -->
              <div v-else class="text-center py-4">
                <p class="text-sm text-x-text-secondary">
                  All {{ filteredNotes.length }} {{ filteredNotes.length === 1 ? 'note' : 'notes' }} loaded
                </p>
              </div>
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

<script setup lang="ts">
import './styles/theme.css';
import './styles/reset.css';
import './styles/global.css';
import { ref, computed, onMounted, watch } from 'vue';
import Database from '@tauri-apps/plugin-sql';
import { invoke } from '@tauri-apps/api/core';
import { marked } from 'marked';
import Fuse from 'fuse.js';
import CalendarView from './components/CalendarView.vue';
import TagsPanel from './components/TagsPanel.vue';
import NoteCreator from './components/NoteCreator.vue';
import NoteItem from './components/NoteItem.vue';
import EmptyState from './components/EmptyState.vue';
import SearchBar from './components/SearchBar.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import SettingsPanel from './components/SettingsPanel.vue';
import NotesHeader from './components/NotesHeader.vue';
import { TAG_REGEX } from './utils/regex';

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

// Get database path from backend
const getDbPath = async (): Promise<string> => {
  try {
    const dbPath = await invoke<string>('get_database_path_cmd');
    console.log('Using database path:', dbPath);
    // Format as SQLite URI - need to convert backslashes to forward slashes on Windows
    const normalizedPath = dbPath.replace(/\\/g, '/');
    return `sqlite:${normalizedPath}`;
  } catch (error) {
    console.error('Failed to get database path:', error);
    // Fallback to old behavior
    return `sqlite:${getDbFilename()}`;
  }
};

const openSettings = () => {
  settingsPanel.value?.openSettings();
};

// Initialize database and load notes
onMounted(async () => {
  try {
    const dbPath = await getDbPath();
    console.log('Initializing database:', dbPath);
    db = await Database.load(dbPath);
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
    const result: Array<{ id: number; content: string; created_at: string }> =
      await db.select(
        'SELECT id, content, created_at FROM notes ORDER BY created_at DESC',
      );

    notes.value = result.map(
      (note: { id: number; content: string; created_at: string }) => ({
        id: note.id,
        content: note.content,
        createdAt: new Date(note.created_at),
      }),
    );
  } catch (error) {
    console.error('Failed to load notes:', error);
  }
};

// Extract tags from note content (words starting with #)
const extractTags = (content: string): string[] => {
  const matches = content.matchAll(TAG_REGEX);
  return Array.from(matches, (m) => m[1].toLowerCase());
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
    filtered = results.map((result) => result.item);
  }

  // Filter by date
  if (selectedDate.value) {
    filtered = filtered.filter((note) => {
      const noteDate = new Date(note.createdAt);
      return noteDate.toDateString() === selectedDate.value!.toDateString();
    });
  }

  // Filter by tags (AND logic - note must have ALL selected tags)
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter((note) => {
      const tags = extractTags(note.content);
      // Check if note has ALL selected tags

      debugger;
      return selectedTags.value.every((selectedTag) =>
        tags.includes(selectedTag),
      );
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
watch(
  [searchQuery, selectedDate, selectedTags],
  () => {
    displayedNotesCount.value = NOTES_PER_PAGE;
  },
  { deep: true },
);

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
      [content, now],
    );

    console.log('Insert result:', result);

    // Add to local array
    notes.value.unshift({
      id: result.lastInsertId,
      content,
      createdAt: new Date(now),
    });

    console.log('Note created successfully');
  } catch (error) {
    console.error('Failed to create note:', error);
  }
};

const deleteNote = async (id: number) => {
  try {
    await db.execute('DELETE FROM notes WHERE id = $1', [id]);
    notes.value = notes.value.filter((note) => note.id !== id);
  } catch (error) {
    console.error('Failed to delete note:', error);
  }
};

const editNote = async (id: number, content: string) => {
  try {
    await db.execute('UPDATE notes SET content = $1 WHERE id = $2', [
      content,
      id,
    ]);

    const note = notes.value.find((n) => n.id === id);
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
  <div class="app-background"></div>

  <main class="main-container">
    <!-- Main Container - Apple-style centered layout with generous spacing -->
    <div class="content-wrapper">
      <!-- Left Column - Search, Calendar and Tags (Glass Panel) -->
      <div class="left-column">
        <div class="left-panel">
          <!-- Search Bar -->
          <div class="search-section">
            <SearchBar @update:search-query="searchQuery = $event" />
          </div>

          <!-- Scrollable Content -->
          <div class="scrollable-content">
            <div class="calendar-wrapper">
              <CalendarView
                :notes="notes"
                :selected-date="selectedDate"
                :current-month="currentMonth"
                @update:selected-date="selectedDate = $event"
                @update:current-month="currentMonth = $event"
              />
            </div>

            <div class="tags-wrapper">
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
      <div class="right-column">
        <!-- Notes Feed - Scrollable Container -->
        <div
          ref="notesContainer"
          class="notes-feed-container"
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
          <div class="note-creator-wrapper">
            <NoteCreator @create="createNote" />
          </div>

          <div v-if="filteredNotes.length > 0" class="notes-list">
            <NoteItem
              v-for="note in displayedNotes"
              :key="note.id"
              :note="note"
              @delete="deleteNote"
              @edit="editNote"
            />

            <!-- Loading indicator when there are more notes -->
            <div v-if="hasMoreNotes" class="loading-indicator">
              <div class="loading-content">
                <svg class="spinner" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="spinner-track"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="spinner-path"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span class="loading-text">
                  Loading more notes... ({{ displayedNotes.length }} of
                  {{ filteredNotes.length }})
                </span>
              </div>
            </div>

            <!-- End of list indicator -->
            <div v-else class="end-indicator">
              <p class="end-text">
                All {{ filteredNotes.length }}
                {{ filteredNotes.length === 1 ? 'note' : 'notes' }} loaded
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

<style scoped>
.app-background {
  background: rgba(35, 35, 35, 0.15);
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.main-container {
  height: calc(100vh - 40px);
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  display: flex;
  gap: 1.5rem;
  height: 100%;
}

.left-column {
  width: 380px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.left-panel {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.search-section {
  padding: 1.5rem 1.5rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
}

.calendar-wrapper {
  padding: 1rem 1rem 0.5rem;
}

.tags-wrapper {
  padding: 0 1rem 1rem;
}

.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.notes-feed-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.note-creator-wrapper {
  margin-bottom: 1.5rem;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-indicator {
  text-align: center;
  padding: 1rem 0;
}

.loading-content {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}

.spinner {
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;
  color: var(--color-text-primary);
}

.spinner-track {
  opacity: 0.25;
}

.spinner-path {
  opacity: 0.75;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.end-indicator {
  text-align: center;
  padding: 1rem 0;
}

.end-text {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
</style>

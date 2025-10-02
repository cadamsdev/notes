<script setup lang="ts">
import './styles/global.css';
import { ref, computed } from 'vue';
import { marked } from 'marked';
import CalendarView from './components/CalendarView.vue';
import TagsPanel from './components/TagsPanel.vue';
import NoteCreator from './components/NoteCreator.vue';
import NoteItem from './components/NoteItem.vue';
import EmptyState from './components/EmptyState.vue';

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
let nextId = 1;

// Extract tags from note content (words starting with #)
const extractTags = (content: string): string[] => {
  const tagRegex = /#(\w+)/g;
  const matches = content.matchAll(tagRegex);
  return Array.from(matches, m => m[1].toLowerCase());
};

const filteredNotes = computed(() => {
  let filtered = notes.value;
  
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

const createNote = (content: string) => {
  notes.value.unshift({
    id: nextId++,
    content,
    createdAt: new Date()
  });
};

const deleteNote = (id: number) => {
  notes.value = notes.value.filter(note => note.id !== id);
};

const editNote = (id: number, content: string) => {
  const note = notes.value.find(n => n.id === id);
  if (note) {
    note.content = content;
  }
};
</script>

<template>
  <main class="min-h-screen flex justify-center bg-[var(--color-x-black)]">
    <!-- Main Container - 2 Column Layout -->
    <div class="w-full max-w-[1200px] flex border-x border-[var(--color-x-border)]">
      
      <!-- Left Column - Calendar and Tags -->
      <div class="w-[400px] border-r border-[var(--color-x-border)] flex flex-col">
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

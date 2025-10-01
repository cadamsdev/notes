<script setup lang="ts">
import './styles/global.css';
import { ref, computed } from 'vue';

interface Note {
  id: number;
  content: string;
  createdAt: Date;
}

const noteContent = ref('');
const notes = ref<Note[]>([]);
const hoveredNoteId = ref<number | null>(null);
const MAX_CHARS = 280;
let nextId = 1;

const charCount = computed(() => noteContent.value.length);
const charCountColor = computed(() => {
  if (charCount.value > MAX_CHARS) return 'text-[var(--color-x-error)]';
  if (charCount.value > MAX_CHARS * 0.9) return 'text-[var(--color-x-warning)]';
  return 'text-[var(--color-x-text-muted)]';
});

const canPost = computed(() => {
  return noteContent.value.trim().length > 0 && charCount.value <= MAX_CHARS;
});

const createNote = () => {
  if (canPost.value) {
    notes.value.unshift({
      id: nextId++,
      content: noteContent.value,
      createdAt: new Date()
    });
    noteContent.value = '';
  }
};

const deleteNote = (id: number) => {
  notes.value = notes.value.filter(note => note.id !== id);
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canPost.value) {
    createNote();
  }
};
</script>

<template>
  <main class="min-h-screen flex justify-center bg-[var(--color-x-black)]">
    <!-- Main Container -->
    <div class="w-full max-w-[600px] border-x border-[var(--color-x-border)]">
      <!-- Header -->
      <header class="sticky top-0 bg-[var(--color-x-black)]/95 backdrop-blur-xl border-b border-[var(--color-x-border)] z-10 shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
        <div class="px-4 py-4">
          <h1 class="text-xl font-bold tracking-tight">My Notes</h1>
        </div>
      </header>

      <!-- Note Creator -->
      <div class="border-b border-[var(--color-x-border)] bg-[var(--color-x-black)]">
        <div class="p-4">
          <div class="flex gap-3">
            <!-- Avatar with gradient -->
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-x-blue)] to-[#1a8cd8] flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>

            <!-- Input Area -->
            <div class="flex-1">
              <textarea
                v-model="noteContent"
                @keydown="handleKeydown"
                placeholder="What's on your mind?"
                class="w-full bg-transparent text-[var(--color-x-text-primary)] placeholder-[var(--color-x-text-muted)] resize-none border-none outline-none text-lg leading-relaxed min-h-[100px] py-2 focus:placeholder-[var(--color-x-text-secondary)]"
                rows="3"
                maxlength="500"
              ></textarea>

              <!-- Character Counter & Actions -->
              <div class="flex items-center justify-between pt-3 mt-2 border-t border-[var(--color-x-border)]">
                <div class="flex items-center gap-2">
                  <!-- Icon Buttons with better hover states -->
                  <button 
                    class="w-9 h-9 rounded-full hover:bg-[var(--color-x-blue-light)] flex items-center justify-center transition-all duration-200 text-[var(--color-x-blue)] hover:scale-110 active:scale-95"
                    title="Add image"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </button>
                  <button 
                    class="w-9 h-9 rounded-full hover:bg-[var(--color-x-blue-light)] flex items-center justify-center transition-all duration-200 text-[var(--color-x-blue)] hover:scale-110 active:scale-95"
                    title="Add emoji"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                  
                  <!-- Character Counter -->
                  <div class="ml-2 flex items-center gap-2">
                    <span :class="['text-sm font-medium transition-colors', charCountColor]">
                      {{ charCount }} / {{ MAX_CHARS }}
                    </span>
                  </div>
                </div>

                <!-- Post Button -->
                <button
                  @click="createNote"
                  :disabled="!canPost"
                  class="px-6 py-2.5 bg-[var(--color-x-blue)] text-white rounded-full font-semibold hover:bg-[var(--color-x-blue-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none hover:scale-105 active:scale-95 disabled:hover:scale-100"
                >
                  Post Note
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Feed -->
      <div class="divide-y divide-[var(--color-x-border)]">
        <div
          v-for="note in notes"
          :key="note.id"
          @mouseenter="hoveredNoteId = note.id"
          @mouseleave="hoveredNoteId = null"
          class="p-4 hover:bg-[var(--color-x-hover)] transition-all duration-200 cursor-pointer group relative"
        >
          <div class="flex gap-3">
            <!-- Avatar with gradient -->
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-x-blue)] to-[#1a8cd8] flex items-center justify-center flex-shrink-0 shadow-md">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>

            <!-- Note Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-[var(--color-x-text-primary)]">You</span>
                  <span class="text-[var(--color-x-text-muted)] text-sm">·</span>
                  <span class="text-[var(--color-x-text-muted)] text-sm">{{ formatDate(note.createdAt) }}</span>
                </div>
                
                <!-- Delete button (shows on hover) -->
                <button
                  @click.stop="deleteNote(note.id)"
                  :class="[
                    'opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-full hover:bg-red-500/10 text-[var(--color-x-text-muted)] hover:text-[var(--color-x-error)]',
                    hoveredNoteId === note.id ? 'scale-100' : 'scale-90'
                  ]"
                  title="Delete note"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
              
              <div class="text-[var(--color-x-text-primary)] whitespace-pre-wrap break-words leading-relaxed">
                {{ note.content }}
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-16 mt-4 text-[var(--color-x-text-muted)]">
                <button class="flex items-center gap-2 group/action transition-all duration-200">
                  <div class="w-8 h-8 rounded-full group-hover/action:bg-[var(--color-x-blue-light)] flex items-center justify-center transition-all duration-200 group-hover/action:scale-110">
                    <svg class="w-4 h-4 group-hover/action:text-[var(--color-x-blue)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                </button>

                <button class="flex items-center gap-2 group/action transition-all duration-200">
                  <div class="w-8 h-8 rounded-full group-hover/action:bg-green-500/10 flex items-center justify-center transition-all duration-200 group-hover/action:scale-110">
                    <svg class="w-4 h-4 group-hover/action:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </div>
                </button>

                <button class="flex items-center gap-2 group/action transition-all duration-200">
                  <div class="w-8 h-8 rounded-full group-hover/action:bg-pink-600/10 flex items-center justify-center transition-all duration-200 group-hover/action:scale-110">
                    <svg class="w-4 h-4 group-hover/action:text-pink-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </div>
                </button>

                <button class="flex items-center gap-2 group/action transition-all duration-200">
                  <div class="w-8 h-8 rounded-full group-hover/action:bg-[var(--color-x-blue-light)] flex items-center justify-center transition-all duration-200 group-hover/action:scale-110">
                    <svg class="w-4 h-4 group-hover/action:text-[var(--color-x-blue)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Empty State -->
        <div v-if="notes.length === 0" class="p-20 text-center">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--color-x-blue-light)] flex items-center justify-center">
            <svg class="w-10 h-10 text-[var(--color-x-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </div>
          <div class="text-[var(--color-x-text-primary)] text-xl font-semibold mb-2">No notes yet</div>
          <div class="text-[var(--color-x-text-secondary)] text-base max-w-sm mx-auto">
            Share your thoughts, ideas, or reminders. Your first note is just a few keystrokes away.
          </div>
          <div class="mt-4 text-[var(--color-x-text-muted)] text-sm">
            Press <kbd class="px-2 py-1 bg-[var(--color-x-border)] rounded text-xs font-mono">Ctrl</kbd> + <kbd class="px-2 py-1 bg-[var(--color-x-border)] rounded text-xs font-mono">Enter</kbd> to post
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

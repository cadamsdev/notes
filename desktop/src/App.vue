<script setup lang="ts">
import './styles/global.css';
import { ref } from 'vue';

interface Note {
  id: number;
  content: string;
  createdAt: Date;
}

const noteContent = ref('');
const notes = ref<Note[]>([]);
let nextId = 1;

const createNote = () => {
  if (noteContent.value.trim()) {
    notes.value.unshift({
      id: nextId++,
      content: noteContent.value,
      createdAt: new Date()
    });
    noteContent.value = '';
  }
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
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    createNote();
  }
};
</script>

<template>
  <main class="min-h-screen flex justify-center">
    <!-- Main Container -->
    <div class="w-full max-w-[600px] border-x border-[var(--color-x-border)]">
      <!-- Header -->
      <header class="sticky top-0 bg-[var(--color-x-black)]/80 backdrop-blur-md border-b border-[var(--color-x-border)] z-10">
        <div class="px-4 py-3">
          <h1 class="text-xl font-bold">Notes</h1>
        </div>
      </header>

      <!-- Note Creator -->
      <div class="border-b border-[var(--color-x-border)] p-4">
        <div class="flex gap-3">
          <!-- Avatar Placeholder -->
          <div class="w-10 h-10 rounded-full bg-[var(--color-x-blue)] flex items-center justify-center flex-shrink-0">
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
              class="w-full bg-transparent text-[var(--color-x-text-primary)] placeholder-[var(--color-x-text-muted)] resize-none border-none outline-none text-xl min-h-[120px] py-3"
              rows="3"
            ></textarea>

            <!-- Action Bar -->
            <div class="flex items-center justify-between pt-3 border-t border-[var(--color-x-border)]">
              <div class="flex gap-1">
                <!-- Icon Buttons -->
                <button class="w-9 h-9 rounded-full hover:bg-[var(--color-x-blue)]/10 flex items-center justify-center transition-colors text-[var(--color-x-blue)]">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </button>
                <button class="w-9 h-9 rounded-full hover:bg-[var(--color-x-blue)]/10 flex items-center justify-center transition-colors text-[var(--color-x-blue)]">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </button>
              </div>

              <!-- Post Button -->
              <button
                @click="createNote"
                :disabled="!noteContent.trim()"
                class="px-4 py-2 bg-[var(--color-x-blue)] text-white rounded-full font-bold hover:bg-[var(--color-x-blue-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Note
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Feed -->
      <div class="divide-y divide-[var(--color-x-border)]">
        <div
          v-for="note in notes"
          :key="note.id"
          class="p-4 hover:bg-[var(--color-x-hover)] transition-colors cursor-pointer"
        >
          <div class="flex gap-3">
            <!-- Avatar -->
            <div class="w-10 h-10 rounded-full bg-[var(--color-x-blue)] flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>

            <!-- Note Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-[var(--color-x-text-primary)]">You</span>
                <span class="text-[var(--color-x-text-muted)] text-sm">·</span>
                <span class="text-[var(--color-x-text-muted)] text-sm">{{ formatDate(note.createdAt) }}</span>
              </div>
              
              <div class="text-[var(--color-x-text-primary)] whitespace-pre-wrap break-words">
                {{ note.content }}
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-12 mt-3 text-[var(--color-x-text-muted)]">
                <button class="flex items-center gap-2 group hover:text-[var(--color-x-blue)] transition-colors">
                  <div class="w-9 h-9 rounded-full group-hover:bg-[var(--color-x-blue)]/10 flex items-center justify-center transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                </button>

                <button class="flex items-center gap-2 group hover:text-green-500 transition-colors">
                  <div class="w-9 h-9 rounded-full group-hover:bg-green-500/10 flex items-center justify-center transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </div>
                </button>

                <button class="flex items-center gap-2 group hover:text-pink-600 transition-colors">
                  <div class="w-9 h-9 rounded-full group-hover:bg-pink-600/10 flex items-center justify-center transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </div>
                </button>

                <button class="flex items-center gap-2 group hover:text-[var(--color-x-blue)] transition-colors">
                  <div class="w-9 h-9 rounded-full group-hover:bg-[var(--color-x-blue)]/10 flex items-center justify-center transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="notes.length === 0" class="p-16 text-center">
          <div class="text-[var(--color-x-text-muted)] text-lg mb-2">No notes yet</div>
          <div class="text-[var(--color-x-text-muted)] text-sm">Start by creating your first note above</div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const noteContent = ref('');

const emit = defineEmits<{
  'create': [content: string];
}>();

const charCount = computed(() => noteContent.value.length);

const canPost = computed(() => {
  return noteContent.value.trim().length > 0;
});

const createNote = () => {
  if (canPost.value) {
    emit('create', noteContent.value);
    noteContent.value = '';
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canPost.value) {
    createNote();
  }
};
</script>

<template>
  <div class="border-b border-[var(--color-x-border)] bg-gradient-to-br from-[var(--color-x-dark)]/50 to-[var(--color-x-darker)]/30">
    <div class="p-5">
      <div class="flex gap-3">
        <!-- Cosmic Avatar -->
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-x-blue)] via-[var(--color-x-nebula-purple)] to-[var(--color-x-rocket)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[var(--color-x-blue)]/50 relative">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <div class="absolute inset-0 rounded-full bg-[var(--color-x-blue)] opacity-50 blur-lg animate-pulse"></div>
        </div>
        
        <!-- Input Area -->
        <div class="flex-1">
          <textarea
            v-model="noteContent"
            @keydown="handleKeydown"
            placeholder="Launch your thoughts into the cosmos..."
            class="w-full bg-[var(--color-x-black)]/40 text-[var(--color-x-text-primary)] placeholder-[var(--color-x-text-muted)] resize-none outline-none text-lg leading-relaxed min-h-[120px] p-4 rounded-xl border-2 border-[var(--color-x-border)] focus:border-[var(--color-x-blue)] focus:placeholder-[var(--color-x-text-secondary)] focus:shadow-[0_0_20px_rgba(0,168,255,0.3)] transition-all duration-300 backdrop-blur-sm"
            rows="3"
          ></textarea>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-4 mt-3 border-t border-[var(--color-x-border)]">
            <!-- Character Count -->
            <div class="text-sm text-[var(--color-x-text-muted)] flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              <span>{{ charCount }} characters</span>
            </div>
            
            <!-- Launch Button -->
            <button
              @click="createNote"
              :disabled="!canPost"
              class="group relative px-6 py-3 bg-gradient-to-r from-[var(--color-x-blue)] to-[var(--color-x-nebula-purple)] text-white rounded-full font-bold hover:from-[var(--color-x-blue-hover)] hover:to-[var(--color-x-nebula-purple)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[var(--color-x-blue)]/50 hover:shadow-[var(--color-x-blue)]/80 hover:shadow-xl disabled:shadow-none hover:scale-105 active:scale-95 disabled:hover:scale-100 overflow-hidden neon-glow"
            >
              <span class="relative z-10 flex items-center gap-2">
                <svg class="w-5 h-5 transition-transform group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                </svg>
                Launch Note
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

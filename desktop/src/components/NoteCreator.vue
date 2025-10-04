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
  <div class="glass-card p-6">
    <!-- Input Area -->
    <textarea
      v-model="noteContent"
      @keydown="handleKeydown"
      placeholder="Share your thoughts..."
      class="w-full bg-transparent text-[var(--color-x-text-primary)] placeholder-[var(--color-x-text-muted)] resize-none outline-none text-base leading-relaxed min-h-[120px] transition-all rounded-lg p-3 -m-3 border-2 border-transparent focus:border-[var(--color-x-blue)] focus:bg-[var(--glass-bg-light)] hover:border-[var(--glass-border-strong)] hover:bg-[var(--glass-bg-light)]"
      rows="4"
    ></textarea>

    <!-- Actions -->
    <div class="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
      <!-- Character Count & Hint -->
      <div class="flex items-center gap-4">
        <div class="text-sm text-[var(--color-x-text-muted)]">
          {{ charCount }} characters
        </div>
        <div class="text-xs text-[var(--color-x-text-muted)] hidden sm:block">
          ⌘ + Enter to post
        </div>
      </div>
      
      <!-- Post Button -->
      <button
        @click="createNote"
        :disabled="!canPost"
        class="px-6 py-3 bg-gradient-to-r from-[var(--color-x-blue)] to-[var(--color-x-blue-hover)] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-md"
      >
        Create Note
      </button>
    </div>
  </div>
</template>

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
  <div class="p-4 border-b border-white/30 backdrop-blur-sm">
    <!-- Input Area -->
    <textarea
      v-model="noteContent"
      @keydown="handleKeydown"
      placeholder="What's on your mind?"
      class="w-full bg-white/60 dark:bg-white/10 backdrop-blur-sm text-[var(--color-x-text-primary)] placeholder-[var(--color-x-text-muted)] resize-none outline-none text-[0.9375rem] leading-relaxed min-h-[100px] p-3 rounded-lg border-2 border-[var(--color-x-text-muted)]/20 dark:border-white/20 focus:border-[var(--color-x-blue)] focus:ring-1 focus:ring-[var(--color-x-blue)] transition-all"
      rows="3"
    ></textarea>

    <!-- Actions -->
    <div class="flex items-center justify-between mt-3">
      <!-- Character Count -->
      <div class="text-xs text-[var(--color-x-text-muted)]">
        {{ charCount }} characters
      </div>
      
      <!-- Post Button -->
      <button
        @click="createNote"
        :disabled="!canPost"
        class="px-4 py-2 bg-[var(--color-x-blue)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-x-blue-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all disabled:hover:bg-[var(--color-x-blue)] shadow-lg"
      >
        Post Note
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from './Button.vue';

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
      class="w-full bg-transparent text-[var(--color-x-text-primary)] placeholder-[var(--color-x-text-muted)] resize-none outline-2 outline-transparent text-base leading-relaxed min-h-[120px] transition-all rounded-lg p-3 -m-3 focus:outline-[var(--color-x-blue)] focus:bg-[var(--glass-bg-light)] hover:outline-[var(--glass-border-strong)] hover:bg-[var(--glass-bg-light)]"
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
      <Button
        @click="createNote"
        :disabled="!canPost"
        variant="primary"
        size="md"
      >
        Create Note
      </Button>
    </div>
  </div>
</template>

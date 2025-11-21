<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from './Button.vue';
import Textarea from './Textarea.vue';

const noteContent = ref('');

const emit = defineEmits<{
  create: [content: string];
}>();

const charCount = computed(() => noteContent.value.length);

const canPost = computed(() => {
  return noteContent.value.trim().length > 0;
});

const createNote = () => {
  console.log(noteContent.value)
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
  <div class="note-creator">
    <!-- Input Area -->
    <Textarea
      class="textarea"
      v-model="noteContent"
      @keydown="handleKeydown"
      placeholder="Share your thoughts..."
    />

    <!-- Actions -->
    <div class="actions">
      <!-- Character Count & Hint -->
      <div class="actions-left">
        <div class="char-count">{{ charCount }} characters</div>
        <div class="keyboard-hint">⌘ + Enter to post</div>
      </div>

      <!-- Post Button -->
      <Button
        @click="createNote"
        :disabled="!canPost"
        variant="primary"
        size="md"
      >
        Create Note →
      </Button>
    </div>
  </div>
</template>

<style scoped>
.note-creator {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.actions-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.char-count {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.keyboard-hint {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.textarea {
  min-height: 120px;
}

@media (max-width: 640px) {
  .keyboard-hint {
    display: none;
  }
}
</style>

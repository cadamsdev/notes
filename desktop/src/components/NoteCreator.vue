<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from './Button.vue';
import Textarea from './Textarea.vue';

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
  <div class="bg-surface border border-border rounded-2xl p-6">
    <!-- Input Area -->
    <Textarea
      v-model="noteContent"
      @keydown="handleKeydown"
      placeholder="Share your thoughts..."
      :rows="4"
      min-height="120px"
    />

    <!-- Actions -->
    <div class="flex items-center justify-between mt-6 pt-4 border-t border-border">
      <!-- Character Count & Hint -->
      <div class="flex items-center gap-4">
        <div class="text-sm text-text-secondary">
          {{ charCount }} characters
        </div>
        <div class="text-xs text-text-secondary hidden sm:block">
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
        Create Note →
      </Button>
    </div>
  </div>
</template>

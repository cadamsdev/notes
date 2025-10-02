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
  <div class="border-b border-[var(--color-x-border)] bg-[var(--color-x-black)]">
    <div class="p-4">
      <div class="flex gap-3">
        <!-- Input Area -->
        <div class="flex-1">
          <textarea
            v-model="noteContent"
            @keydown="handleKeydown"
            placeholder="What's on your mind?"
            class="w-full bg-transparent text-[var(--color-x-text-primary)] placeholder-[var(--color-x-text-muted)] resize-none border-none outline-none text-lg leading-relaxed min-h-[100px] py-2 focus:placeholder-[var(--color-x-text-secondary)]"
            rows="3"
          ></textarea>

          <!-- Actions -->
          <div class="flex items-center justify-end pt-3 mt-2 border-t border-[var(--color-x-border)]">
            <!-- Post Button -->
            <button
              @click="createNote"
              :disabled="!canPost"
              class="px-6 py-2.5 bg-[var(--color-btn-primary)] text-[var(--color-btn-primary-text)] rounded-full font-semibold hover:bg-[var(--color-btn-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none hover:scale-105 active:scale-95 disabled:hover:scale-100"
            >
              Post Note
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

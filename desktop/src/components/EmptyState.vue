<script setup lang="ts">
interface Props {
  hasDateFilter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasDateFilter: false
});
</script>

<template>
  <div class="p-20 text-center">
    <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--color-x-blue-light)] flex items-center justify-center">
      <svg class="w-10 h-10 text-[var(--color-x-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
      </svg>
    </div>
    <div class="text-[var(--color-x-text-primary)] text-xl font-semibold mb-2">
      {{ hasDateFilter ? 'No notes for this date' : 'No notes yet' }}
    </div>
    <div class="text-[var(--color-x-text-secondary)] text-base max-w-sm mx-auto">
      {{ hasDateFilter ? 'Try selecting a different date or create a new note.' : 'Share your thoughts, ideas, or reminders. Your first note is just a few keystrokes away.' }}
    </div>
    <div v-if="!hasDateFilter" class="mt-4 text-[var(--color-x-text-muted)] text-sm">
      Press <kbd class="px-2 py-1 bg-[var(--color-x-border)] rounded text-xs font-mono">Ctrl</kbd> + <kbd class="px-2 py-1 bg-[var(--color-x-border)] rounded text-xs font-mono">Enter</kbd> to post
    </div>
  </div>
</template>

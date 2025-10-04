<script setup lang="ts">
interface Props {
  hasDateFilter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasDateFilter: false
});
</script>

<template>
  <div class="p-16 text-center">
    <!-- Icon -->
    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--glass-bg-medium)] backdrop-blur-sm flex items-center justify-center border border-[var(--glass-border)]">
      <svg class="w-8 h-8 text-[var(--color-x-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
      </svg>
    </div>
    
    <!-- Title -->
    <div class="text-[var(--color-x-text-primary)] text-lg font-semibold mb-2">
      {{ hasDateFilter ? 'No notes found' : 'No notes yet' }}
    </div>
    
    <!-- Description -->
    <div class="text-[var(--color-x-text-secondary)] text-sm max-w-sm mx-auto mb-6">
      {{ hasDateFilter 
        ? 'No notes on this date. Try selecting a different date or create a new note.' 
        : 'Start by creating your first note above.' 
      }}
    </div>
    
    <!-- Keyboard Shortcut Hint -->
    <div v-if="!hasDateFilter" class="inline-flex items-center gap-2 px-3 py-2 bg-[var(--glass-bg-medium)] backdrop-blur-sm rounded-lg border border-[var(--glass-border)]">
      <span class="text-xs text-[var(--color-x-text-muted)]">Quick tip:</span>
      <kbd class="px-2 py-1 bg-[var(--glass-bg-strong)] border border-[var(--glass-border-strong)] rounded text-xs font-mono text-[var(--color-x-text-secondary)]">Ctrl</kbd>
      <span class="text-xs text-[var(--color-x-text-muted)]">+</span>
      <kbd class="px-2 py-1 bg-[var(--glass-bg-strong)] border border-[var(--glass-border-strong)] rounded text-xs font-mono text-[var(--color-x-text-secondary)]">Enter</kbd>
      <span class="text-xs text-[var(--color-x-text-muted)]">to post</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hasDateFilter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasDateFilter: false,
});
</script>

<template>
  <div class="empty-state">
    <!-- Icon -->
    <div class="empty-icon">
      <svg
        class="icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </div>

    <!-- Title -->
    <div class="empty-title">
      {{ hasDateFilter ? 'No notes found' : 'No notes yet' }}
    </div>

    <!-- Description -->
    <div class="empty-description">
      {{
        hasDateFilter
          ? 'No notes on this date. Try selecting a different date or create a new note.'
          : 'Start by creating your first note above.'
      }}
    </div>

    <!-- Keyboard Shortcut Hint -->
    <div v-if="!hasDateFilter" class="keyboard-hint">
      <span class="hint-text">Quick tip:</span>
      <kbd class="kbd">Ctrl</kbd>
      <span class="hint-text">+</span>
      <kbd class="kbd">Enter</kbd>
      <span class="hint-text">to post</span>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  padding: 4rem;
  text-align: center;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background-color: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
}

.icon {
  width: 2rem;
  height: 2rem;
  color: var(--color-text-secondary);
}

.empty-title {
  color: var(--color-text-primary);
  font-size: 1.125rem;
  font-weight: var(--font-weight-semibold);
  margin-bottom: 0.5rem;
}

.empty-description {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  max-width: 28rem;
  margin: 0 auto 1.5rem;
}

.keyboard-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-surface);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

.hint-text {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.kbd {
  padding: 0.25rem 0.5rem;
  background-color: var(--color-surface-active);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--color-text-secondary);
}
</style>

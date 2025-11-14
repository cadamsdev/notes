<script setup lang="ts">
interface Props {
  noteCount: number;
}

defineProps<Props>();

const emit = defineEmits<{
  'open-settings': [];
}>();

const handleSettingsClick = () => {
  emit('open-settings');
};
</script>

<template>
  <header class="notes-header">
    <div class="header-container">
      <div class="header-content">
        <div class="app-icon">
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
        <div class="header-info">
          <h1 class="app-title">Notes</h1>
          <p class="note-count">
            {{ noteCount }} {{ noteCount === 1 ? 'note' : 'notes' }}
          </p>
        </div>
      </div>
      <div class="header-actions">
        <!-- Settings Button -->
        <button
          @click="handleSettingsClick"
          class="settings-button"
          title="Settings"
        >
          <svg
            class="settings-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
        <slot name="theme-toggle" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.notes-header {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  margin-bottom: 1.5rem;
}

.header-container {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background-color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-background);
}

.header-info {
  flex: 1;
}

.app-title {
  font-size: 1.25rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
}

.note-count {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.125rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.settings-button {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all 0.2s;
}

.settings-button:hover {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

.settings-icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>

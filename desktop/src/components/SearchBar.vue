<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits<{
  'update:search-query': [query: string];
}>();

const searchQuery = ref('');

// Emit search query changes
watch(searchQuery, (newQuery) => {
  emit('update:search-query', newQuery);
});

const clearSearch = () => {
  searchQuery.value = '';
};
</script>

<template>
  <div class="search-container">
    <!-- Search Icon -->
    <svg class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>

    <!-- Search Input -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search your notes..."
      class="search-input"
    />

    <!-- Clear Button -->
    <button v-if="searchQuery" @click="clearSearch" class="clear-button" title="Clear search">
      <svg class="clear-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text-secondary);
  transition: color 0.2s;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem;
  font-size: 1rem;
  color: var(--color-text-primary);
  background-color: transparent;
  border: 2px solid var(--color-border);
  border-radius: 0.75rem;
  transition: all 0.2s;
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.search-input:hover {
  border-color: var(--color-border-hover);
  background-color: var(--color-surface);
}

.search-input:focus {
  border-color: var(--color-border-active);
  background-color: var(--color-surface);
}

.clear-button {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: var(--color-text-secondary);
  transition: all 0.2s;
}

.clear-button:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
}

.clear-icon {
  width: 1rem;
  height: 1rem;
}
</style>

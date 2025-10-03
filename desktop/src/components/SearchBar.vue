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
  <div class="px-4 py-3 border-b border-white/30 glass-dark">
    <div class="relative">
      <!-- Search Icon -->
      <svg 
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-x-text-muted)] transition-colors duration-200 pointer-events-none"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        stroke-width="2"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>

      <!-- Search Input -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search notes..."
        class="w-full pl-9 pr-9 py-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm border-2 border-[var(--color-x-text-muted)]/20 dark:border-white/20 rounded-lg text-sm text-[var(--color-x-text-primary)] focus:outline-none focus:border-[var(--color-x-blue)] focus:ring-1 focus:ring-[var(--color-x-blue)] transition-all placeholder-[var(--color-x-text-muted)]"
      />

      <!-- Clear Button -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/60 dark:hover:bg-white/20 text-[var(--color-x-text-muted)] hover:text-[var(--color-x-text-primary)] transition-all backdrop-blur-sm"
        title="Clear search"
      >
        <svg 
          class="w-4 h-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          stroke-width="2"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
    </div>
  </div>
</template>

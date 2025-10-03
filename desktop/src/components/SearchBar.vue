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
  <div class="px-4 py-3 border-b border-[var(--color-x-border)] bg-[var(--color-x-black)]">
    <div class="relative">
      <!-- Search Icon -->
      <svg 
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-x-text-muted)]"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>

      <!-- Search Input -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search notes..."
        class="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-x-blue)] focus:border-transparent transition-all placeholder-[var(--color-x-text-muted)]"
      />

      <!-- Clear Button -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-x-text-muted)] hover:text-[var(--color-x-text)] transition-colors"
      >
        <svg 
          class="w-4 h-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
    </div>
  </div>
</template>

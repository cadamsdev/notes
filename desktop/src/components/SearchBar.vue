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
  <div class="px-5 py-4 border-b border-[var(--color-x-border)] bg-gradient-to-r from-[var(--color-x-dark)]/95 to-[var(--color-x-darker)]/95 backdrop-blur-xl relative z-10">
    <div class="relative group">
      <!-- Search Icon -->
      <svg 
        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-x-blue)] transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-[var(--color-x-nebula-cyan)]"
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
        placeholder="Search across the cosmos..."
        class="w-full pl-12 pr-12 py-3.5 bg-[var(--color-x-black)]/60 border-2 border-[var(--color-x-border)] rounded-full text-sm text-[var(--color-x-text-primary)] focus:outline-none focus:border-[var(--color-x-blue)] focus:shadow-[0_0_25px_rgba(0,168,255,0.4)] transition-all duration-300 placeholder-[var(--color-x-text-muted)] backdrop-blur-md"
      />

      <!-- Scanning Animation Line -->
      <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-x-blue)] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
        <div class="h-full w-1/3 bg-[var(--color-x-nebula-cyan)] animate-pulse"></div>
      </div>

      <!-- Clear Button -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[var(--color-x-hover)] text-[var(--color-x-text-muted)] hover:text-[var(--color-x-text-primary)] hover:bg-[var(--color-x-blue)]/20 transition-all duration-300 flex items-center justify-center border border-transparent hover:border-[var(--color-x-blue)]/50 hover:shadow-[0_0_10px_rgba(0,168,255,0.3)]"
        title="Clear search"
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

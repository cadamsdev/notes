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
  <div class="relative">
    <!-- Search Icon -->
    <svg 
      class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-x-text-muted transition-colors duration-200 pointer-events-none"
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
      placeholder="Search your notes..."
      class="w-full pl-12 pr-12 py-4 text-base text-x-text-primary placeholder-x-text-muted focus:outline-none focus:ring-2 focus:ring-x-blue/20 focus:border-transparent transition-all rounded-xl bg-glass-bg-strong backdrop-blur-[20px] border border-glass-border-strong shadow-[var(--shadow-md),var(--glass-inner-shadow),var(--glass-outer-glow),0_8px_24px_rgba(0,0,0,0.08)]"
      style="backdrop-filter: saturate(160%) blur(20px); -webkit-backdrop-filter: saturate(160%) blur(20px);"
    />

    <!-- Clear Button -->
    <button
      v-if="searchQuery"
      @click="clearSearch"
      class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/20 text-x-text-muted hover:text-x-text-primary transition-all"
      title="Clear search"
    >
      <svg 
        class="w-4 h-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          d="M6 18L18 6M6 6l12 12" 
        />
      </svg>
    </button>
  </div>
</template>

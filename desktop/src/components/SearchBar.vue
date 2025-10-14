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
      class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary transition-colors duration-200 pointer-events-none"
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
      class="w-full pl-12 pr-12 py-4 text-base text-text-primary border-border placeholder-text-secondary bg-transparent border-2 transition-all rounded-xl focus:border-border-active focus:bg-surface hover:border-border-hover hover:bg-surface outline-none"
    />

    <!-- Clear Button -->
    <button
      v-if="searchQuery"
      @click="clearSearch"
      class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-all"
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

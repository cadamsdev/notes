<script setup lang="ts">
import { computed } from 'vue';
import CalendarView from './CalendarView.vue';
import TagsPanel from './TagsPanel.vue';
import SearchBar from './SearchBar.vue';

interface Note {
  id: number;
  content: string;
  createdAt: Date;
}

interface Props {
  notes: Note[];
  selectedDate: Date | null;
  selectedTags: string[];
  currentMonth: Date;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:selectedDate': [date: Date | null];
  'update:selectedTags': [tags: string[]];
  'update:currentMonth': [month: Date];
  'update:searchQuery': [query: string];
}>();
</script>

<template>
  <div class="side-panel">
    <!-- Search Bar -->
    <div class="search-section">
      <SearchBar @update:search-query="emit('update:searchQuery', $event)" />
    </div>

    <!-- Scrollable Content -->
    <div class="scrollable-content">
      <div class="calendar-wrapper">
        <CalendarView
          :notes="notes"
          :selected-date="selectedDate"
          :current-month="currentMonth"
          @update:selected-date="emit('update:selectedDate', $event)"
          @update:current-month="emit('update:currentMonth', $event)"
        />
      </div>

      <div class="tags-wrapper">
        <TagsPanel
          :notes="notes"
          :selected-tags="selectedTags"
          @update:selected-tags="emit('update:selectedTags', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.side-panel {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.search-section {
  padding: 1.5rem 1.5rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
}

.calendar-wrapper {
  padding: 1rem 1rem 0.5rem;
}

.tags-wrapper {
  padding: 0 1rem 1rem;
}
</style>

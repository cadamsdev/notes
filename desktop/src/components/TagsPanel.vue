<script setup lang="ts">
import { computed } from 'vue';

interface Note {
  id: number;
  content: string;
  createdAt: Date;
}

interface Props {
  notes: Note[];
  selectedTag: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:selectedTag': [tag: string | null];
}>();

// Extract tags from note content (words starting with #)
const extractTags = (content: string): string[] => {
  const tagRegex = /#(\w+)/g;
  const matches = content.matchAll(tagRegex);
  return Array.from(matches, m => m[1].toLowerCase());
};

// Get all unique tags from all notes
const allTags = computed(() => {
  const tagSet = new Set<string>();
  props.notes.forEach(note => {
    const tags = extractTags(note.content);
    tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
});

// Get note count for each tag
const getNotesCountForTag = (tag: string): number => {
  return props.notes.filter(note => {
    const tags = extractTags(note.content);
    return tags.includes(tag);
  }).length;
};

const selectTag = (tag: string) => {
  if (props.selectedTag === tag) {
    emit('update:selectedTag', null); // Deselect if clicking the same tag
  } else {
    emit('update:selectedTag', tag);
  }
};
</script>

<template>
  <div class="p-4">
    <div class="flex items-center gap-2 mb-3">
      <svg class="w-4 h-4 text-[var(--color-x-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
      </svg>
      <h3 class="text-sm font-semibold text-[var(--color-x-text-primary)]">
        Tags
      </h3>
    </div>
    
    <div v-if="allTags.length > 0" class="flex flex-wrap gap-2">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="selectTag(tag)"
        :class="[
          'px-2.5 py-1 rounded-full text-xs font-medium transition-all backdrop-blur-sm',
          selectedTag === tag 
            ? 'bg-[var(--color-x-blue)] text-white shadow-lg' 
            : 'bg-white/60 text-[var(--color-x-text-secondary)] hover:bg-white/80 hover:text-[var(--color-x-blue)]'
        ]"
      >
        #{{ tag }}
        <span :class="[
          'ml-1.5 px-1.5 py-0.5 rounded text-xs',
          selectedTag === tag ? 'bg-white/20' : 'bg-[var(--color-x-blue)]/10'
        ]">
          {{ getNotesCountForTag(tag) }}
        </span>
      </button>
    </div>
    
    <div v-else class="text-[var(--color-x-text-muted)] text-xs p-3 bg-white/60 rounded-lg backdrop-blur-sm">
      No tags yet. Add hashtags like <span class="text-[var(--color-x-blue)] font-mono">#ideas</span> to organize your notes.
    </div>
    
    <!-- Selected Tag Info -->
    <div v-if="selectedTag" class="mt-3 p-2.5 glass-dark rounded-lg border border-white/30">
      <div class="text-xs text-[var(--color-x-text-secondary)] mb-1">
        Filtering by tag
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-[var(--color-x-text-primary)]">#{{ selectedTag }}</span>
        <button
          @click="emit('update:selectedTag', null)"
          class="px-2 py-1 text-xs font-medium text-[var(--color-x-blue)] hover:bg-white/60 rounded transition-all backdrop-blur-sm"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
</template>

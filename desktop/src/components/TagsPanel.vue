<script setup lang="ts">
import { computed } from 'vue';

interface Note {
  id: number;
  content: string;
  createdAt: Date;
}

interface Props {
  notes: Note[];
  selectedTags: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:selectedTags': [tags: string[]];
}>();

// Extract tags from note content (words starting with #)
const extractTags = (content: string): string[] => {
  const tagRegex = /#(\w+)/g;
  const matches = content.matchAll(tagRegex);
  return Array.from(matches, m => m[1].toLowerCase());
};

// Get notes filtered by currently selected tags
const filteredNotes = computed(() => {
  if (props.selectedTags.length === 0) {
    return props.notes;
  }
  
  return props.notes.filter(note => {
    const tags = extractTags(note.content);
    // Note must have ALL selected tags
    return props.selectedTags.every(selectedTag => tags.includes(selectedTag));
  });
});

// Get all unique tags from filtered notes (contextual tags based on selection)
const allTags = computed(() => {
  const tagSet = new Set<string>();
  filteredNotes.value.forEach(note => {
    const tags = extractTags(note.content);
    tags.forEach(tag => {
      // Don't include already selected tags in the available list
      if (!props.selectedTags.includes(tag)) {
        tagSet.add(tag);
      }
    });
  });
  
  // Add selected tags at the beginning
  const selectedTagsArray = [...props.selectedTags];
  const availableTags = Array.from(tagSet).sort();
  
  return [...selectedTagsArray, ...availableTags];
});

// Get note count for each tag (considering current filter)
const getNotesCountForTag = (tag: string): number => {
  return filteredNotes.value.filter(note => {
    const tags = extractTags(note.content);
    return tags.includes(tag);
  }).length;
};

const toggleTag = (tag: string) => {
  const currentTags = [...props.selectedTags];
  const index = currentTags.indexOf(tag);
  
  if (index > -1) {
    // Remove tag if already selected
    currentTags.splice(index, 1);
  } else {
    // Add tag if not selected
    currentTags.push(tag);
  }
  
  emit('update:selectedTags', currentTags);
};

const clearAllTags = () => {
  emit('update:selectedTags', []);
};

const isTagSelected = (tag: string) => {
  return props.selectedTags.includes(tag);
};
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
        <h3 class="text-sm font-semibold text-text-primary">
          Tags
        </h3>
        <span v-if="selectedTags.length > 0" class="text-xs text-text-secondary">
          ({{ selectedTags.length }} selected)
        </span>
      </div>
      
      <!-- Clear all button -->
      <button
        v-if="selectedTags.length > 0"
        @click="clearAllTags"
        class="text-xs text-text-primary hover:text-text-secondary font-medium transition-colors"
      >
        Clear all
      </button>
    </div>
    
    <div v-if="allTags.length > 0" class="flex flex-wrap gap-2">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="toggleTag(tag)"
        :class="[
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
          isTagSelected(tag)
            ? 'bg-text-primary text-background shadow-md border border-text-primary' 
            : 'bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary border border-border'
        ]"
      >
        <span class="leading-none">#{{ tag }}</span>
        <span :class="[
          'inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold leading-none',
          isTagSelected(tag) ? 'bg-background/20 text-background' : 'bg-surface-active text-text-primary'
        ]">
          {{ getNotesCountForTag(tag) }}
        </span>
      </button>
    </div>
    
    <div v-else class="text-text-secondary text-xs p-3 bg-surface rounded-lg">
      No tags yet. Add hashtags like <span class="text-text-primary font-mono">#ideas</span> to organize your notes.
    </div>
  </div>
</template>

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
  <div class="border-t border-[var(--color-x-border)] p-4">
    <h3 class="text-base font-semibold mb-3">Tags</h3>
    
    <div v-if="allTags.length > 0" class="flex flex-wrap gap-2">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="selectTag(tag)"
        :class="[
          'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
          selectedTag === tag 
            ? 'bg-[var(--color-btn-primary)] text-[var(--color-btn-primary-text)] shadow-md' 
            : 'bg-[var(--color-x-hover)] text-[var(--color-x-text-primary)] hover:bg-[var(--color-x-border)]'
        ]"
      >
        #{{ tag }}
        <span class="ml-1.5 text-xs opacity-70">{{ getNotesCountForTag(tag) }}</span>
      </button>
    </div>
    
    <div v-else class="text-[var(--color-x-text-muted)] text-sm">
      No tags yet. Add hashtags to your notes like #ideas or #todo to organize them.
    </div>
    
    <!-- Selected Tag Info -->
    <div v-if="selectedTag" class="mt-3 p-2 bg-[var(--color-x-hover)] rounded-lg border border-[var(--color-x-border)]">
      <div class="text-xs text-[var(--color-x-text-secondary)] mb-1">Filtering by tag</div>
      <div class="flex items-center justify-between">
        <span class="font-medium text-[var(--color-x-text-primary)] text-sm">#{{ selectedTag }}</span>
        <button
          @click="emit('update:selectedTag', null)"
          class="text-xs text-[var(--color-x-blue)] hover:underline"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
</template>

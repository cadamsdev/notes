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
  <div class="border-t border-[var(--color-x-border)] p-5 bg-gradient-to-br from-[var(--color-x-darker)]/30 to-[var(--color-x-dark)]/20">
    <div class="flex items-center gap-2 mb-4">
      <svg class="w-5 h-5 text-[var(--color-x-rocket)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
      </svg>
      <h3 class="text-base font-semibold bg-gradient-to-r from-[var(--color-x-text-primary)] to-[var(--color-x-rocket)] bg-clip-text text-transparent">
        Tags System
      </h3>
    </div>
    
    <div v-if="allTags.length > 0" class="flex flex-wrap gap-2">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="selectTag(tag)"
        :class="[
          'group relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden',
          selectedTag === tag 
            ? 'bg-gradient-to-r from-[var(--color-x-rocket)] to-[var(--color-x-nebula-purple)] text-white shadow-lg shadow-[var(--color-x-rocket)]/50 scale-105 ring-2 ring-[var(--color-x-rocket)]' 
            : 'bg-[var(--color-x-hover)] text-[var(--color-x-text-primary)] hover:bg-[var(--color-x-blue)]/20 border border-[var(--color-x-border)] hover:border-[var(--color-x-blue)]/50 hover:shadow-[0_0_15px_rgba(0,168,255,0.3)]'
        ]"
      >
        <span class="relative z-10 flex items-center gap-2">
          <span>#{{ tag }}</span>
          <span :class="[
            'px-2 py-0.5 rounded-full text-xs font-bold',
            selectedTag === tag ? 'bg-white/20' : 'bg-[var(--color-x-border)]'
          ]">
            {{ getNotesCountForTag(tag) }}
          </span>
        </span>
        
        <!-- Animated background for non-selected tags -->
        <div v-if="selectedTag !== tag" class="absolute inset-0 bg-gradient-to-r from-[var(--color-x-blue)]/0 via-[var(--color-x-blue)]/10 to-[var(--color-x-blue)]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      </button>
    </div>
    
    <div v-else class="text-[var(--color-x-text-muted)] text-sm p-4 bg-[var(--color-x-black)]/30 rounded-xl border border-[var(--color-x-border)] border-dashed">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-[var(--color-x-blue)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p>No tags detected yet. Add hashtags like <span class="text-[var(--color-x-blue)] font-mono">#ideas</span> or <span class="text-[var(--color-x-rocket)] font-mono">#todo</span> to organize your cosmic thoughts.</p>
      </div>
    </div>
    
    <!-- Selected Tag Info -->
    <div v-if="selectedTag" class="mt-4 p-4 bg-gradient-to-br from-[var(--color-x-hover)] to-[var(--color-x-dark)] rounded-xl border border-[var(--color-x-rocket)]/30 shadow-[0_0_20px_rgba(255,107,53,0.2)]">
      <div class="text-xs text-[var(--color-x-rocket)] mb-2 font-semibold uppercase tracking-wider flex items-center gap-2">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
        </svg>
        <span>Active Filter</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="font-bold text-[var(--color-x-text-primary)] text-base">#{{ selectedTag }}</span>
        <button
          @click="emit('update:selectedTag', null)"
          class="px-3 py-1.5 text-xs font-semibold text-[var(--color-x-rocket)] bg-[var(--color-x-rocket)]/10 hover:bg-[var(--color-x-rocket)]/20 rounded-lg transition-all duration-300 border border-[var(--color-x-rocket)]/30 hover:border-[var(--color-x-rocket)] hover:shadow-[0_0_10px_rgba(255,107,53,0.3)]"
        >
          Clear Filter
        </button>
      </div>
    </div>
  </div>
</template>

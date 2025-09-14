<script setup lang="ts">
interface Note {
  id: number;
  content: string;
  tags: string[];
  date: string;
  time: string;
}

interface Props {
  note: Note;
  showActions?: boolean;
  contentPreview?: boolean;
  maxContentLines?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  contentPreview: true,
  maxContentLines: 3
});

const emit = defineEmits<{
  noteClick: [noteId: number];
  editNote: [noteId: number];
  deleteNote: [noteId: number];
  tagClick: [tagName: string];
}>();

const handleNoteClick = () => {
  emit('noteClick', props.note.id);
};

const handleEditNote = (event: Event) => {
  event.stopPropagation();
  emit('editNote', props.note.id);
};

const handleDeleteNote = (event: Event) => {
  event.stopPropagation();
  emit('deleteNote', props.note.id);
};

const handleTagClick = (event: Event, tagName: string) => {
  event.stopPropagation();
  emit('tagClick', tagName);
};

const contentLineClampClass = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3'
}[props.maxContentLines] || 'line-clamp-3';
</script>

<template>
  <div 
    @click="handleNoteClick"
    class="bg-gray-800 rounded-lg p-4 lg:p-6 border border-gray-700 hover:border-gray-600 transition-colors duration-200 cursor-pointer group"
  >
    <!-- Note Header -->
    <div class="flex items-start justify-between mb-2 lg:mb-3">
      <div class="text-xs lg:text-sm text-gray-400 whitespace-nowrap">
        {{ note.date }} • {{ note.time }}
      </div>
    </div>
    
    <!-- Note Content Preview -->
    <p 
      v-if="contentPreview"
      class="text-gray-300 leading-relaxed mb-3 lg:mb-4 text-sm lg:text-base"
      :class="contentLineClampClass"
    >
      {{ note.content }}
    </p>
    
    <!-- Note Tags and Actions -->
    <div class="flex items-center justify-between">
      <div class="flex flex-wrap gap-1 lg:gap-2">
        <button
          v-for="tag in note.tags" 
          :key="tag"
          @click="(e) => handleTagClick(e, tag)"
          class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full hover:bg-gray-600 transition-colors duration-200"
        >
          {{ tag }}
        </button>
      </div>
      
      <!-- Note Actions -->
      <div 
        v-if="showActions"
        class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <button 
          @click="handleEditNote"
          class="text-gray-400 hover:text-gray-300 transition-colors duration-200"
          title="Edit note"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
        </button>
        <button 
          @click="handleDeleteNote"
          class="text-gray-400 hover:text-red-400 transition-colors duration-200"
          title="Delete note"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

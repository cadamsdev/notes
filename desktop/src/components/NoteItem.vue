<script setup lang="ts">
import { ref } from 'vue';
import { marked } from 'marked';

interface Note {
  id: number;
  content: string;
  createdAt: Date;
}

interface Props {
  note: Note;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'delete': [id: number];
  'edit': [id: number, content: string];
}>();

const isHovered = ref(false);
const isEditing = ref(false);
const editContent = ref('');

const startEditing = () => {
  isEditing.value = true;
  editContent.value = props.note.content;
};

const cancelEditing = () => {
  isEditing.value = false;
  editContent.value = '';
};

const saveEdit = () => {
  if (editContent.value.trim()) {
    emit('edit', props.note.id, editContent.value);
    cancelEditing();
  }
};

const handleEditKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    saveEdit();
  } else if (e.key === 'Escape') {
    cancelEditing();
  }
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Render markdown to HTML
const renderMarkdown = (content: string): string => {
  return marked.parse(content) as string;
};
</script>

<template>
  <div
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    class="p-4 hover:bg-[var(--color-x-hover)] transition-all duration-200 cursor-pointer group relative"
  >
    <div class="flex gap-3">
      <!-- Note Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <span class="text-[var(--color-x-text-muted)] text-sm">{{ formatDate(note.createdAt) }}</span>
          </div>
          
          <!-- Action buttons (show on hover) -->
          <div class="flex items-center gap-1">
            <button
              v-if="!isEditing"
              @click.stop="startEditing"
              :class="[
                'opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-full hover:bg-[var(--color-x-blue-light)] text-[var(--color-x-text-muted)] hover:text-[var(--color-x-blue)]',
                isHovered ? 'scale-100' : 'scale-90'
              ]"
              title="Edit note"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            
            <button
              v-if="!isEditing"
              @click.stop="$emit('delete', note.id)"
              :class="[
                'opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-full hover:bg-red-500/10 text-[var(--color-x-text-muted)] hover:text-[var(--color-x-error)]',
                isHovered ? 'scale-100' : 'scale-90'
              ]"
              title="Delete note"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Edit Mode -->
        <div v-if="isEditing" class="space-y-2">
          <textarea
            v-model="editContent"
            @keydown="handleEditKeydown"
            class="w-full bg-[var(--color-x-hover)] text-[var(--color-x-text-primary)] placeholder-[var(--color-x-text-muted)] resize-none border border-[var(--color-x-border)] outline-none rounded-lg p-3 text-base leading-relaxed min-h-[100px] focus:border-[var(--color-x-blue)]"
            rows="3"
            autofocus
          ></textarea>
          
          <div class="flex items-center justify-end">
            <div class="flex gap-2">
              <button
                @click="cancelEditing"
                class="px-4 py-1.5 text-sm font-medium text-[var(--color-x-text-primary)] hover:bg-[var(--color-x-hover)] rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                @click="saveEdit"
                :disabled="!editContent.trim()"
                class="px-4 py-1.5 text-sm font-semibold bg-[var(--color-btn-primary)] text-[var(--color-btn-primary-text)] rounded-full hover:bg-[var(--color-btn-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
        
        <!-- View Mode -->
        <div 
          v-else 
          class="text-[var(--color-x-text-primary)] whitespace-pre-wrap break-words leading-relaxed prose prose-invert prose-sm max-w-none"
          v-html="renderMarkdown(note.content)"
        ></div>
      </div>
    </div>
  </div>
</template>

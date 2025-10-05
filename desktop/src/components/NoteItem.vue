<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { renderMarkdown } from '../utils/markdown';

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
const showDeleteModal = ref(false);
const renderedContent = ref('');

// Render markdown when component mounts or note changes
const updateRenderedContent = async () => {
  renderedContent.value = await renderMarkdown(props.note.content);
};

onMounted(() => {
  updateRenderedContent();
});

// Watch for note content changes
watch(() => props.note.content, () => {
  updateRenderedContent();
});

const startEditing = () => {
  isEditing.value = true;
  editContent.value = props.note.content;
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
};

const handleDelete = () => {
  emit('delete', props.note.id);
  showDeleteModal.value = false;
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
</script>

<template>
  <div
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    class="glass-card group hover:shadow-lg transition-all duration-200 p-3"
  >
    <div class="flex items-start justify-between mb-4">
      <!-- Time -->
      <span class="text-sm text-x-text-muted font-medium">
        {{ formatDate(note.createdAt) }}
      </span>
      
      <!-- Action buttons (show on hover) -->
      <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          v-if="!isEditing"
          @click.stop="startEditing"
          class="p-2 rounded-lg hover:bg-white/20 text-x-text-muted hover:text-x-text-primary transition-all duration-200 hover:scale-105"
          title="Edit note"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </button>
        
        <button
          v-if="!isEditing"
          @click.stop="confirmDelete"
          class="p-2 rounded-lg hover:bg-red-500/10 text-x-text-muted hover:text-x-error transition-all duration-200 hover:scale-105"
          title="Delete note"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Edit Mode -->
    <div v-if="isEditing" class="space-y-4">
      <textarea
        v-model="editContent"
        @keydown="handleEditKeydown"
        class="w-full bg-transparent text-x-text-primary placeholder-x-text-muted resize-none outline-none text-base leading-relaxed min-h-[120px] border border-white/20 rounded-xl p-4 focus:border-x-blue/50 focus:ring-2 focus:ring-x-blue/20 transition-all"
        rows="4"
        autofocus
      ></textarea>
      
      <div class="flex items-center justify-end gap-3">
        <button
          @click="cancelEditing"
          class="px-4 py-2 text-sm font-medium text-x-text-primary hover:bg-white/20 rounded-lg transition-all"
        >
          Cancel
        </button>
        <button
          @click="saveEdit"
          :disabled="!editContent.trim()"
          class="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-x-blue to-x-blue-hover text-white rounded-lg hover:shadow-lg hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-md"
        >
          Save Changes
        </button>
      </div>
    </div>
    
    <!-- View Mode -->
    <div 
      v-else 
      class="text-x-text-primary prose prose-sm max-w-none leading-relaxed"
      v-html="renderedContent"
    ></div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
          @click="cancelDelete"
        >
          <div
            class="glass-panel border border-white/30 rounded-2xl shadow-2xl max-w-sm w-full p-8"
            @click.stop
          >
            <!-- Icon -->
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-x-error/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-x-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>

            <!-- Title -->
            <h3 class="text-lg font-semibold text-x-text-primary text-center mb-2">
              Delete note?
            </h3>

            <!-- Description -->
            <p class="text-sm text-x-text-secondary text-center mb-6">
              This note will be permanently deleted. This action cannot be undone.
            </p>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="cancelDelete"
                class="flex-1 px-4 py-2 text-sm font-medium text-x-text-primary hover:bg-white/60 dark:hover:bg-white/20 rounded-lg transition-all backdrop-blur-sm"
              >
                Cancel
              </button>
              <button
                @click="handleDelete"
                class="flex-1 px-4 py-2 text-sm font-medium bg-x-error text-white rounded-lg hover:bg-x-error-hover hover:shadow-xl transition-all shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .bg-\[var\(--color-x-black\)\],
.modal-leave-active .bg-\[var\(--color-x-black\)\] {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-\[var\(--color-x-black\)\] {
  transform: scale(0.95);
  opacity: 0;
}

.modal-leave-to .bg-\[var\(--color-x-black\)\] {
  transform: scale(0.95);
  opacity: 0;
}
</style>

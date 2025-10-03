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
    class="p-5 hover:bg-gradient-to-br hover:from-[var(--color-x-hover)] hover:to-[var(--color-x-dark)]/30 transition-all duration-300 cursor-pointer group relative border-l-4 border-transparent hover:border-l-[var(--color-x-blue)] hover:shadow-[inset_0_0_20px_rgba(0,168,255,0.05)]"
  >
    <!-- Cosmic glow effect on hover -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-x-blue)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    
    <div class="flex gap-4 relative z-10">
      <!-- Cosmic Avatar -->
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-x-blue)]/30 via-[var(--color-x-nebula-purple)]/20 to-[var(--color-x-rocket)]/10 flex items-center justify-center flex-shrink-0 border border-[var(--color-x-border)] group-hover:border-[var(--color-x-blue)]/50 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,168,255,0.3)]">
        <svg class="w-5 h-5 text-[var(--color-x-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
        </svg>
      </div>
      
      <!-- Note Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <!-- Time Badge -->
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-x-black)]/40 border border-[var(--color-x-border)] rounded-full text-xs font-semibold text-[var(--color-x-blue)] backdrop-blur-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ formatDate(note.createdAt) }}
            </span>
          </div>
          
          <!-- Action buttons (show on hover) -->
          <div class="flex items-center gap-1.5">
            <button
              v-if="!isEditing"
              @click.stop="startEditing"
              :class="[
                'opacity-0 group-hover:opacity-100 transition-all duration-300 p-2.5 rounded-lg bg-[var(--color-x-hover)] hover:bg-[var(--color-x-blue)]/20 text-[var(--color-x-text-muted)] hover:text-[var(--color-x-blue)] border border-transparent hover:border-[var(--color-x-blue)]/50 hover:shadow-[0_0_10px_rgba(0,168,255,0.3)]',
                isHovered ? 'scale-100 translate-x-0' : 'scale-90 translate-x-2'
              ]"
              title="Edit note"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            
            <button
              v-if="!isEditing"
              @click.stop="confirmDelete"
              :class="[
                'opacity-0 group-hover:opacity-100 transition-all duration-300 p-2.5 rounded-lg bg-[var(--color-x-hover)] hover:bg-[var(--color-x-error)]/20 text-[var(--color-x-text-muted)] hover:text-[var(--color-x-error)] border border-transparent hover:border-[var(--color-x-error)]/50 hover:shadow-[0_0_10px_rgba(255,71,87,0.3)]',
                isHovered ? 'scale-100 translate-x-0' : 'scale-90 translate-x-2'
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
        <div v-if="isEditing" class="space-y-3">
          <textarea
            v-model="editContent"
            @keydown="handleEditKeydown"
            class="w-full bg-[var(--color-x-black)]/60 text-[var(--color-x-text-primary)] placeholder-[var(--color-x-text-muted)] resize-none border-2 border-[var(--color-x-border)] outline-none rounded-xl p-4 text-base leading-relaxed min-h-[120px] focus:border-[var(--color-x-blue)] focus:shadow-[0_0_20px_rgba(0,168,255,0.2)] transition-all duration-300 backdrop-blur-sm"
            rows="3"
            autofocus
          ></textarea>
          
          <div class="flex items-center justify-end gap-2">
            <button
              @click="cancelEditing"
              class="px-5 py-2 text-sm font-semibold text-[var(--color-x-text-primary)] bg-[var(--color-x-hover)] hover:bg-[var(--color-x-border)] rounded-lg transition-all duration-300 border border-[var(--color-x-border)] hover:border-[var(--color-x-text-muted)]"
            >
              Cancel
            </button>
            <button
              @click="saveEdit"
              :disabled="!editContent.trim()"
              class="px-5 py-2 text-sm font-bold bg-gradient-to-r from-[var(--color-x-blue)] to-[var(--color-x-nebula-purple)] text-white rounded-lg hover:from-[var(--color-x-blue-hover)] hover:to-[var(--color-x-nebula-purple)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[var(--color-x-blue)]/30 hover:shadow-[var(--color-x-blue)]/50 disabled:shadow-none hover:scale-105 active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
        
        <!-- View Mode -->
        <div 
          v-else 
          class="text-[var(--color-x-text-primary)] whitespace-pre-wrap break-words prose prose-invert prose-sm max-w-none leading-0"
          v-html="renderedContent"
        ></div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          @click="cancelDelete"
        >
          <div
            class="bg-gradient-to-br from-[var(--color-x-dark)] to-[var(--color-x-darker)] border-2 border-[var(--color-x-error)]/30 rounded-2xl shadow-[0_0_60px_rgba(255,71,87,0.4)] max-w-md w-full p-7 relative overflow-hidden"
            @click.stop
          >
            <!-- Animated glow -->
            <div class="absolute inset-0 bg-gradient-to-br from-[var(--color-x-error)]/5 to-transparent pointer-events-none"></div>
            
            <!-- Icon -->
            <div class="relative w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-[var(--color-x-error)]/20 to-[var(--color-x-error)]/5 flex items-center justify-center border-2 border-[var(--color-x-error)]/30 shadow-[0_0_20px_rgba(255,71,87,0.3)]">
              <svg class="w-8 h-8 text-[var(--color-x-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>

            <!-- Title -->
            <h3 class="text-2xl font-bold text-[var(--color-x-text-primary)] text-center mb-3 bg-gradient-to-r from-[var(--color-x-text-primary)] to-[var(--color-x-error)] bg-clip-text text-transparent">
              Delete Transmission?
            </h3>

            <!-- Description -->
            <p class="text-[var(--color-x-text-secondary)] text-center mb-7 leading-relaxed">
              This cosmic entry will be permanently erased from the timeline. This action cannot be undone.
            </p>

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                @click="cancelDelete"
                class="flex-1 px-5 py-3 text-sm font-semibold text-[var(--color-x-text-primary)] bg-[var(--color-x-hover)] hover:bg-[var(--color-x-border)] rounded-xl transition-all duration-300 border border-[var(--color-x-border)] hover:border-[var(--color-x-blue)]/50 hover:shadow-[0_0_15px_rgba(0,168,255,0.2)]"
              >
                Cancel
              </button>
              <button
                @click="handleDelete"
                class="flex-1 px-5 py-3 text-sm font-bold bg-gradient-to-r from-[var(--color-x-error)] to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-[var(--color-x-error)]/30 hover:shadow-[var(--color-x-error)]/50 hover:scale-105 active:scale-95"
              >
                Delete Forever
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

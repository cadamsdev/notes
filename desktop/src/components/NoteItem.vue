<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { renderMarkdown } from '../utils/markdown';
import Button from './Button.vue';
import Textarea from './Textarea.vue';
import '../styles/markdown.css';

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
  delete: [id: number];
  edit: [id: number, content: string];
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
watch(
  () => props.note.content,
  () => {
    updateRenderedContent();
  },
);

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
    class="note-item"
  >
    <div class="note-header">
      <!-- Time -->
      <span class="note-time">
        {{ formatDate(note.createdAt) }}
      </span>

      <!-- Action buttons (show on hover) -->
      <div class="action-buttons">
        <button
          v-if="!isEditing"
          @click.stop="startEditing"
          class="action-button"
          title="Edit note"
        >
          <svg
            class="action-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        <button
          v-if="!isEditing"
          @click.stop="confirmDelete"
          class="action-button"
          title="Delete note"
        >
          <svg
            class="action-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-if="isEditing" class="edit-mode">
      <Textarea
        v-model="editContent"
        @keydown="handleEditKeydown"
        :rows="4"
        min-height="120px"
        autofocus
      />

      <div class="edit-actions">
        <Button @click="cancelEditing" variant="ghost" size="sm">
          Cancel
        </Button>
        <Button
          @click="saveEdit"
          :disabled="!editContent.trim()"
          variant="primary"
          size="sm"
        >
          Save Changes
        </Button>
      </div>
    </div>

    <!-- View Mode -->
    <div v-else class="markdown" v-html="renderedContent"></div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
          <div class="modal-content" @click.stop>
            <!-- Icon -->
            <div class="modal-icon">
              <svg
                class="modal-icon-svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <!-- Title -->
            <h3 class="modal-title">Delete note?</h3>

            <!-- Description -->
            <p class="modal-description">
              This note will be permanently deleted. This action cannot be
              undone.
            </p>

            <!-- Actions -->
            <div class="modal-actions">
              <Button @click="cancelDelete" variant="ghost" fullWidth size="sm">
                Cancel
              </Button>

              <Button
                @click="handleDelete"
                variant="primary"
                fullWidth
                size="sm"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.note-item {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  transition: all 0.2s;
  padding: 0.75rem;
}

.note-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.note-time {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transition: all 0.2s;
}

.note-item:hover .action-buttons {
  opacity: 1;
}

.action-button {
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: var(--color-text-secondary);
  transition: all 0.2s;
}

.action-button:hover {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  transform: scale(1.05);
}

.action-icon {
  width: 1rem;
  height: 1rem;
}

.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.markdown {
  color: var(--color-text-primary);
  max-width: 100%;
  line-height: 1.6;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: var(--color-background-overlay);
}

.modal-content {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 28rem;
  width: 100%;
  padding: 2rem;
}

.modal-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background-color: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon-svg {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-text-primary);
}

.modal-title {
  font-size: 1.125rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 0.5rem;
}

.modal-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content {
  transform: scale(0.95);
  opacity: 0;
}

.modal-leave-to .modal-content {
  transform: scale(0.95);
  opacity: 0;
}
</style>

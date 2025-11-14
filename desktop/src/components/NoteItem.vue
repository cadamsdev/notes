<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { renderMarkdown } from '../utils/markdown';
import Button from './Button.vue';
import Textarea from './Textarea.vue';
import ConfirmModal from './ConfirmModal.vue';
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
const showDiscardModal = ref(false);
const renderedContent = ref('');
const isExpanded = ref(false);
const contentElement = ref<HTMLElement | null>(null);
const isContentOverflowing = ref(false);

// Render markdown when component mounts or note changes
const updateRenderedContent = async () => {
  renderedContent.value = await renderMarkdown(props.note.content);
  // Check if content overflows after render
  setTimeout(() => {
    checkContentOverflow();
  }, 0);
};

const checkContentOverflow = () => {
  if (contentElement.value) {
    const maxHeight = 200; // 200px max height
    isContentOverflowing.value = contentElement.value.scrollHeight > maxHeight;
  }
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
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
  isExpanded.value = true; // Expand note when editing
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
  // Check if content changed to warn user
  if (editContent.value !== props.note.content) {
    showDiscardModal.value = true;
  } else {
    // No changes made, just exit edit mode
    isEditing.value = false;
    editContent.value = '';
  }
};

const confirmDiscard = () => {
  showDiscardModal.value = false;
  isEditing.value = false;
  editContent.value = '';
};

const cancelDiscard = () => {
  showDiscardModal.value = false;
};

const saveEdit = () => {
  const trimmedContent = editContent.value.trim();
  if (trimmedContent && trimmedContent !== props.note.content) {
    emit('edit', props.note.id, editContent.value);
    isEditing.value = false;
    editContent.value = '';
  } else if (trimmedContent === props.note.content) {
    // No changes made, just exit edit mode
    isEditing.value = false;
    editContent.value = '';
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

    <!-- Content container with edit overlay -->
    <div class="content-container" :class="{ editing: isEditing }">
      <!-- View Mode (always rendered, hidden during edit) -->
      <div
        ref="contentElement"
        class="markdown"
        :class="{ 'is-hidden': isEditing, 'is-collapsed': !isExpanded && isContentOverflowing }"
        v-html="renderedContent"
      ></div>

      <!-- Expand/Collapse button -->
      <button
        v-if="isContentOverflowing && !isEditing"
        @click="toggleExpand"
        class="expand-button"
      >
        {{ isExpanded ? 'Show less' : 'Read more' }}
        <svg
          class="expand-icon"
          :class="{ 'is-rotated': isExpanded }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <!-- Edit Mode (overlay on top of content) -->
      <Transition name="edit-fade">
        <div v-if="isEditing" class="edit-overlay">
          <Textarea
            v-model="editContent"
            @keydown="handleEditKeydown"
            class="edit-textarea"
            autofocus
          />

          <div class="edit-footer">
            <div class="keyboard-hint">
              <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd> to save ·
              <kbd>Esc</kbd> to cancel
            </div>
            <div class="edit-actions">
              <Button @click="cancelEditing" variant="ghost" size="sm">
                Cancel
              </Button>
              <Button
                @click="saveEdit"
                :disabled="!editContent.trim() || editContent === note.content"
                variant="primary"
                size="sm"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="showDeleteModal"
      title="Delete note?"
      message="This note will be permanently deleted. This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      icon="delete"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />

    <!-- Discard Changes Modal -->
    <ConfirmModal
      :show="showDiscardModal"
      title="Discard changes?"
      message="You have unsaved changes. Are you sure you want to discard them?"
      confirmText="Discard"
      cancelText="Keep Editing"
      variant="warning"
      icon="warning"
      @confirm="confirmDiscard"
      @cancel="cancelDiscard"
    />
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

.content-container {
  position: relative;
  min-height: fit-content;
}

.markdown {
  color: var(--color-text-primary);
  max-width: 100%;
  line-height: 1.6;
  transition: max-height 0.3s ease;
  overflow: hidden;
}

.markdown.is-collapsed {
  max-height: 200px;
  position: relative;
}

.markdown.is-collapsed::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, transparent, var(--color-surface));
  pointer-events: none;
}

.markdown.is-hidden {
  visibility: hidden;
}

.expand-button {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  border-radius: 0.5rem;
  transition: all 0.2s;
  background-color: transparent;
}

.expand-button:hover {
  color: var(--color-text-primary);
  background-color: var(--color-surface-hover);
}

.expand-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.3s ease;
}

.expand-icon.is-rotated {
  transform: rotate(180deg);
}

.edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-textarea {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  resize: none;
  background-color: var(--color-background);
  border-color: var(--color-border-active);
}

.edit-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-shrink: 0;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
}

.keyboard-hint {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.keyboard-hint kbd {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
  font-family: var(--font-family-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.edit-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-shrink: 0;
}

/* Edit mode transitions */
.edit-fade-enter-active,
.edit-fade-leave-active {
  transition: opacity 0.15s ease;
}

.edit-fade-enter-from,
.edit-fade-leave-to {
  opacity: 0;
}
</style>

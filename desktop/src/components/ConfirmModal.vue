<script setup lang="ts">
import Button from './Button.vue';

interface Props {
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  icon?: 'warning' | 'delete' | 'question';
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'primary',
  icon: 'question',
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const getIconPath = () => {
  switch (props.icon) {
    case 'warning':
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
    case 'delete':
      return 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16';
    case 'question':
    default:
      return 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="emit('cancel')">
        <div class="modal-content" @click.stop>
          <!-- Icon -->
          <div class="modal-icon" :class="variant">
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
                :d="getIconPath()"
              />
            </svg>
          </div>

          <!-- Title -->
          <h3 class="modal-title">{{ title }}</h3>

          <!-- Message -->
          <p class="modal-message">{{ message }}</p>

          <!-- Actions -->
          <div class="modal-actions">
            <Button @click="emit('cancel')" variant="ghost" fullWidth size="sm">
              {{ cancelText }}
            </Button>

            <Button
              @click="emit('confirm')"
              variant="primary"
              fullWidth
              size="sm"
            >
              {{ confirmText }}
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon.primary {
  background-color: var(--color-surface);
}

.modal-icon.warning {
  background-color: rgba(251, 191, 36, 0.1);
}

.modal-icon.danger {
  background-color: rgba(239, 68, 68, 0.1);
}

.modal-icon-svg {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-text-primary);
}

.modal-icon.warning .modal-icon-svg {
  color: rgb(251, 191, 36);
}

.modal-icon.danger .modal-icon-svg {
  color: rgb(239, 68, 68);
}

.modal-title {
  font-size: 1.125rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 0.5rem;
}

.modal-message {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.5;
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

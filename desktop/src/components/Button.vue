<script setup lang="ts">
interface Props {
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: 'primary',
  size: 'md',
  fullWidth: false,
});

const emit = defineEmits<{
  click: [];
}>();

const handleClick = () => {
  if (!props.disabled) {
    emit('click');
  }
};
</script>

<template>
  <button
    @click="handleClick"
    :disabled="disabled"
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-full-width': fullWidth },
      { 'btn-disabled': disabled },
    ]"
  >
    <!-- Shine effect on hover (only for primary and secondary) -->
    <span v-if="!disabled && variant !== 'ghost'" class="btn-shine"></span>

    <!-- Content -->
    <span class="btn-content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
  overflow: hidden;
  border: 1px solid;
  border-radius: 0;
}

/* Size variants */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.btn-md {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1rem;
}

/* Width */
.btn-full-width {
  width: 100%;
}

/* Primary variant */
.btn-primary {
  background-color: var(--color-gray-900);
  color: var(--color-gray-100);
  border-color: var(--color-gray-700);
}

.btn-primary:not(.btn-disabled):hover {
  background-color: var(--color-gray-800);
  border-color: var(--color-gray-600);
  color: var(--color-gray-900);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.btn-primary:not(.btn-disabled):active {
  transform: scale(0.95);
}

.btn-primary.btn-disabled {
  background-color: var(--color-gray-300);
  color: var(--color-gray-500);
  border-color: var(--color-gray-400);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Secondary variant */
.btn-secondary {
  background-color: transparent;
  color: var(--color-gray-900);
  border-color: var(--color-gray-700);
}

.btn-secondary:not(.btn-disabled):hover {
  border-color: var(--color-gray-600);
  background-color: var(--color-gray-900);
  color: var(--color-gray-100);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.btn-secondary:not(.btn-disabled):active {
  transform: scale(0.95);
}

.btn-secondary.btn-disabled {
  background-color: transparent;
  color: var(--color-gray-500);
  border-color: var(--color-gray-400);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Ghost variant */
.btn-ghost {
  background-color: transparent;
  color: var(--color-text-primary);
  border-color: transparent;
}

.btn-ghost:not(.btn-disabled):hover {
  background-color: var(--color-gray-900);
  color: var(--color-gray-100);
  border-color: transparent;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-ghost:not(.btn-disabled):active {
  transform: scale(0.95);
}

.btn-ghost.btn-disabled {
  background-color: transparent;
  color: var(--color-gray-400);
  border-color: transparent;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Shine effect */
.btn-shine {
  position: absolute;
  inset: 0;
  width: 0;
  background-color: hsl(0, 0%, 100%);
  transition: all 0.3s ease-out;
}

.btn-primary:not(.btn-disabled):hover .btn-shine,
.btn-secondary:not(.btn-disabled):hover .btn-shine {
  width: 100%;
}

/* Content */
.btn-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
</style>

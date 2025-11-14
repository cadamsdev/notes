<script setup lang="ts">
interface Props {
  modelValue: string;
  placeholder?: string;
  rows?: number;
  minHeight?: string;
  disabled?: boolean;
  autofocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  rows: 4,
  minHeight: '120px',
  disabled: false,
  autofocus: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  keydown: [event: KeyboardEvent];
}>();

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};

const handleKeydown = (e: KeyboardEvent) => {
  emit('keydown', e);
};
</script>

<template>
  <textarea
    :value="modelValue"
    @input="handleInput"
    @keydown="handleKeydown"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    :autofocus="autofocus"
    :style="{ minHeight }"
    :class="['textarea', { 'textarea-disabled': disabled }]"
  ></textarea>
</template>

<style scoped>
.textarea {
  width: 100%;
  background-color: transparent;
  color: var(--color-text-primary);
  resize: none;
  border: 2px solid var(--color-border);
  font-size: 1rem;
  line-height: 1.6;
  transition: all 0.2s;
  border-radius: 0.5rem;
  padding: 0.75rem;
  outline: none;
}

.textarea::placeholder {
  color: var(--color-text-secondary);
}

.textarea:hover:not(.textarea-disabled) {
  border-color: var(--color-border-hover);
  background-color: var(--color-surface);
}

.textarea:focus:not(.textarea-disabled),
.textarea:focus-visible:not(.textarea-disabled) {
  border-color: var(--color-border-active);
}

.textarea-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

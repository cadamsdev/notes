<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'

interface Props {
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  autofocus?: boolean;
  rows?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  autofocus: false,
  rows: 2,
  modelValue: '',
});

const { textarea, input } = useTextareaAutosize({
  styleProp: 'minHeight',
  input: props.modelValue,
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
    ref="textarea"
    v-model="input"
    @input="handleInput"
    @keydown="handleKeydown"
    :placeholder="placeholder"
    :disabled="disabled"
    :autofocus="autofocus"
    :rows="rows"
    class="textarea"
  ></textarea>
</template>

<style scoped>
.textarea {
  -ms-overflow-style: none;
  scrollbar-width: none;
  width: 100%;
  background-color: transparent;
  color: var(--color-text-primary);
  border: 2px solid var(--color-border);
  font-size: 1rem;
  line-height: 1.6;
  transition:
    border-color 0.2s,
    background-color 0.2s;
  border-radius: 0.5rem;
  padding: 0.75rem;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  resize: none;
  overflow-y: hidden;
}

.textarea::-webkit-scrollbar {
  display: none;
}

.textarea::placeholder {
  color: var(--color-text-secondary);
  opacity: 1;
}

.textarea:hover:not(:disabled) {
  border-color: var(--color-border-hover);
  background-color: var(--color-surface);
}

.textarea:focus:not(:disabled),
.textarea:focus-visible:not(:disabled) {
  border-color: var(--color-border-active);
}

.textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  user-select: none;
}
</style>

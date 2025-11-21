<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
  autofocus?: boolean;
}

withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  autofocus: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  keydown: [event: KeyboardEvent];
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};

const handleKeydown = (e: KeyboardEvent) => {
  emit('keydown', e);
};

// Expose focus method for parent components
defineExpose({
  focus: () => textareaRef.value?.focus(),
});
</script>

<template>
  <textarea
    ref="textareaRef"
    :value="modelValue"
    @input="handleInput"
    @keydown="handleKeydown"
    :placeholder="placeholder"
    :disabled="disabled"
    :autofocus="autofocus"
    :style="{ minHeight }"
    class="textarea"
  ></textarea>
</template>

<style scoped>
.textarea {
  field-sizing: content;
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
  resize: vertical;
  overflow-y: hidden;
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

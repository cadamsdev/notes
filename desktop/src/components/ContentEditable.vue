<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
  autofocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  minHeight: '120px',
  disabled: false,
  autofocus: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  keydown: [event: KeyboardEvent];
}>();

const editableRef = ref<HTMLDivElement | null>(null);
const showPlaceholder = ref(true);

const handleInput = () => {
  if (!editableRef.value) return;

  const text = editableRef.value.innerText;
  showPlaceholder.value = text.length === 0;
  emit('update:modelValue', text);
};

const handleKeydown = (e: KeyboardEvent) => {
  emit('keydown', e);
};

const updateContent = (newValue: string) => {
  if (!editableRef.value) return;

  // Only update if different to avoid cursor jumping
  if (editableRef.value.innerText !== newValue) {
    editableRef.value.innerText = newValue;
  }

  showPlaceholder.value = newValue.length === 0;
};

// Focus if autofocus is enabled
onMounted(() => {
  if (props.autofocus && editableRef.value) {
    nextTick(() => {
      editableRef.value?.focus();
    });
  }

  // Initialize placeholder state
  updateContent(props.modelValue);
});

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    updateContent(newValue);
  },
);

// Expose focus method for parent components
defineExpose({
  focus: () => editableRef.value?.focus(),
});
</script>

<template>
  <div class="content-editable-wrapper">
    <div
      ref="editableRef"
      contenteditable
      @input="handleInput"
      @keydown="handleKeydown"
      :class="['content-editable', { 'content-editable-disabled': disabled }]"
      :style="{ minHeight }"
      :aria-disabled="disabled"
      role="textbox"
      aria-multiline="true"
    ></div>
    <div v-if="showPlaceholder" class="placeholder">{{ placeholder }}</div>
  </div>
</template>

<style scoped>
.content-editable-wrapper {
  position: relative;
  width: 100%;
}

.content-editable {
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
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.content-editable:empty:before {
  content: '';
}

.placeholder {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  color: var(--color-text-secondary);
  pointer-events: none;
  font-size: 1rem;
  line-height: 1.6;
}

.content-editable:hover:not(.content-editable-disabled) {
  border-color: var(--color-border-hover);
  background-color: var(--color-surface);
}

.content-editable:focus:not(.content-editable-disabled),
.content-editable:focus-visible:not(.content-editable-disabled) {
  border-color: var(--color-border-active);
}

.content-editable-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  user-select: none;
}

.content-editable-disabled[contenteditable] {
  -webkit-user-modify: read-only;
}
</style>

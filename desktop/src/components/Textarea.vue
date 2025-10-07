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
  'keydown': [event: KeyboardEvent];
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
    :class="[
      'w-full bg-transparent text-x-text-primary placeholder-x-text-muted',
      'resize-none border-2 border-x-border text-base leading-relaxed',
      'transition-all rounded-lg p-3 outline-none',
      {
        'focus:border-x-text-secondary focus-visible:border-transparent': !disabled,
        'hover:border-x-hover hover:bg-glass-bg-light': !disabled,
        'opacity-50 cursor-not-allowed': disabled,
      }
    ]"
  ></textarea>
</template>

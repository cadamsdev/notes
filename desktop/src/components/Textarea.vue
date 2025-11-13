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
      'w-full bg-transparent text-text-primary placeholder-text-secondary',
      'resize-none border-2 border-border text-base leading-relaxed',
      'transition-all rounded-lg p-3 outline-none',
      {
        'focus:border-border-active focus-visible:border-border-active': !disabled,
        'hover:border-border-hover hover:bg-surface': !disabled,
        'opacity-50 cursor-not-allowed': disabled,
      }
    ]"
  ></textarea>
</template>

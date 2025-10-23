<script setup lang="ts">
interface Props {
  tag: string;
  count: number;
  selected?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    @click="emit('click')"
    :class="[
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
      selected
        ? 'bg-text-primary text-background shadow-md border border-text-primary' 
        : 'bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary border border-border'
    ]"
  >
    <span class="leading-none">#{{ tag }}</span>
    <span :class="[
      'inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold leading-none',
      selected ? 'bg-background/20 text-background' : 'bg-surface-active text-text-primary'
    ]">
      {{ count }}
    </span>
  </button>
</template>

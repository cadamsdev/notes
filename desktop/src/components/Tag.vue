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
  <button @click="emit('click')" :class="['tag', { 'tag-selected': selected }]">
    <span class="tag-name">#{{ tag }}</span>
    <span :class="['tag-count', { 'tag-count-selected': selected }]">
      {{ count }}
    </span>
  </button>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.tag:hover:not(.tag-selected) {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
}

.tag-selected {
  background-color: var(--color-text-primary);
  color: var(--color-background);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-color: var(--color-text-primary);
}

.tag-name {
  line-height: 1;
}

.tag-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  background-color: var(--color-surface-active);
  color: var(--color-text-primary);
}

.tag-count-selected {
  background-color: rgba(var(--color-background), 0.2);
  color: var(--color-background);
}
</style>

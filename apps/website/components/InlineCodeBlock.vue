<template>
  <div class="code-block">
    <code>{{ code }}</code>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  code: string
}>()
</script>

<style scoped>
.code-block {
  background-color: var(--color-gray-900);
  color: var(--color-gray-100);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: var(--font-size-sm);
  overflow-x: auto;
  margin: var(--spacing-md) 0;
}

:global(body.dark) .code-block {
  background-color: var(--color-gray-950);
}

.code-block code {
  white-space: nowrap;
}
</style>

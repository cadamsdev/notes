<template>
  <div class="code-block">
    <code>{{ code }}</code>
    <button 
      class="copy-button" 
      @click="copyToClipboard"
      :title="copied ? 'Copied!' : 'Copy to clipboard'"
    >
      <Icon :name="copied ? 'heroicons:check' : 'heroicons:clipboard-document'" class="copy-icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  code: string
}>()

const copied = ref(false)

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
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
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

:global(body.dark) .code-block {
  background-color: var(--color-gray-950);
}

.code-block code {
  white-space: nowrap;
  flex: 1;
}

.copy-button {
  background: none;
  border: none;
  padding: var(--spacing-xs);
  cursor: pointer;
  color: var(--color-gray-400);
  border-radius: var(--radius-sm);
  transition: color var(--transition-base), background-color var(--transition-base);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-button:hover {
  color: var(--color-gray-100);
  background-color: var(--color-gray-700);
}

.copy-icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>

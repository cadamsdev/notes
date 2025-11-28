<template>
  <div class="accordion">
    <button 
      class="accordion-trigger" 
      @click="toggle"
      :aria-expanded="isOpen"
    >
      <slot name="icon" />
      <span class="accordion-title">
        <slot name="title" />
      </span>
      <Icon 
        name="heroicons:chevron-down" 
        :class="['accordion-chevron', { 'accordion-chevron-open': isOpen }]" 
      />
    </button>
    <div v-show="isOpen" class="accordion-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false
})

const isOpen = ref(props.defaultOpen)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.accordion {
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-200);
  overflow: hidden;
}

body.dark .accordion {
  background-color: var(--color-gray-900);
  border-color: var(--color-gray-700);
}

.accordion-trigger {
  width: 100%;
  padding: var(--spacing-xl);
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background-color var(--transition-base);
}

.accordion-trigger:hover {
  background-color: var(--color-gray-50);
}

body.dark .accordion-trigger {
  color: var(--color-white);
}

body.dark .accordion-trigger:hover {
  background-color: var(--color-gray-800);
}

.accordion-title {
  flex: 1;
}

.accordion-chevron {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-gray-400);
  flex-shrink: 0;
  transition: transform var(--transition-base);
}

.accordion-chevron-open {
  transform: rotate(180deg);
}

.accordion-content {
  padding: 0 var(--spacing-xl) var(--spacing-xl) var(--spacing-xl);
  color: var(--color-gray-600);
  line-height: 1.7;
}

body.dark .accordion-content {
  color: var(--color-gray-300);
}
</style>

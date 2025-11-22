<template>
  <div class="tech-card">
    <Icon :name="icon" :style="{ color }" class="tech-icon" />
    <h3 class="tech-name">{{ name }}</h3>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  icon: string
  color: string
}>()
</script>

<style scoped>
.tech-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-lg);
  background-color: var(--color-white);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-gray-200);
  transition: box-shadow var(--transition-base);
}

.tech-card:hover {
  box-shadow: var(--shadow-lg);
}

body.dark .tech-card {
  background-color: var(--color-gray-900);
  border-color: var(--color-gray-700);
}

.tech-icon {
  width: 4rem;
  height: 4rem;
  margin-bottom: var(--spacing-md);
}

.tech-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-900);
}

body.dark .tech-name {
  color: var(--color-white);
}
</style>

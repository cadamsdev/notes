<template>
  <div class="feature-card">
    <div class="card-header">
      <Icon :name="icon" class="header-icon" />
      <h3 class="card-title">{{ title }}</h3>
    </div>
    <ul class="feature-list">
      <li v-for="(feature, index) in features" :key="index" class="feature-item">
        <Icon name="heroicons:check-circle" class="check-icon" />
        <span class="feature-text">{{ feature }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  features: string[]
}>()
</script>

<style scoped>
.feature-card {
  background-color: var(--color-gray-50);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-gray-200);
  transition: box-shadow var(--transition-base);
}

.feature-card:hover {
  box-shadow: var(--shadow-lg);
}

body.dark .feature-card {
  background-color: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.header-icon {
  width: 2rem;
  height: 2rem;
  color: var(--color-primary-600);
  margin-right: var(--spacing-md);
}

body.dark .header-icon {
  color: var(--color-primary-400);
}

.card-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
}

body.dark .card-title {
  color: var(--color-white);
}

.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.feature-item {
  display: flex;
  align-items: flex-start;
}

.check-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-success);
  margin-right: var(--spacing-sm);
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.feature-text {
  color: var(--color-gray-600);
}

body.dark .feature-text {
  color: var(--color-gray-300);
}
</style>

<template>
  <div class="download-card">
    <div class="icon-container">
      <Icon :name="icon" class="platform-icon" />
    </div>
    <h3 class="platform-name">{{ platform }}</h3>
    <div class="download-buttons">
      <a 
        v-for="(download, index) in downloads" 
        :key="index"
        href="https://github.com/usenotex/notex/releases"
        target="_blank"
        rel="noopener noreferrer"
        class="download-button"
      >
        <Icon name="heroicons:arrow-down-tray" class="button-icon" />
        {{ download.name }}
      </a>
    </div>
    <p class="file-types">
      {{ downloads.map(d => d.ext).join(', ') }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  platform: string
  icon: string
  downloads: Array<{ name: string; ext: string }>
}>()
</script>

<style scoped>
.download-card {
  background-color: var(--color-gray-50);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-gray-200);
}

body.dark .download-card {
  background-color: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}

.platform-icon {
  width: 3rem;
  height: 3rem;
  color: var(--color-gray-700);
}

body.dark .platform-icon {
  color: var(--color-gray-300);
}

.platform-name {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

body.dark .platform-name {
  color: var(--color-white);
}

.download-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.download-button {
  display: block;
  width: 100%;
  background-color: var(--color-primary-600);
  color: var(--color-white);
  text-align: center;
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  font-weight: 500;
  text-decoration: none;
  transition: background-color var(--transition-base);
}

.download-button:hover {
  background-color: var(--color-primary-700);
}

.button-icon {
  width: 1rem;
  height: 1rem;
  display: inline;
  margin-right: var(--spacing-sm);
}

.file-types {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  margin-top: var(--spacing-md);
  text-align: center;
}

body.dark .file-types {
  color: var(--color-gray-400);
}
</style>

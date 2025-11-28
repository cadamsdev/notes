<template>
  <section class="section tech-section">
    <div class="container-custom">
      <div class="section-header">
        <h2 class="section-title">
          Built with Modern Tech
        </h2>
        <p class="section-description">
          Powered by cutting-edge technologies for maximum performance and reliability
        </p>
      </div>

      <div class="tech-grid">
        <TechCard name="Tauri" icon="simple-icons:tauri" color="#24C8DB" />
        <TechCard name="Vue 3" icon="mdi:vuejs" color="#42b883" />
        <TechCard name="Rust" icon="mdi:language-rust" color="#CE412B" />
        <TechCard name="SQLite" icon="simple-icons:sqlite" color="#003B57" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.tech-section {
  background-color: var(--color-gray-50);
}

body.dark .tech-section {
  background-color: var(--color-gray-800);
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.section-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-md);
}

body.dark .section-title {
  color: var(--color-white);
}

.section-description {
  font-size: var(--font-size-xl);
  color: var(--color-gray-600);
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
}

body.dark .section-description {
  color: var(--color-gray-300);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-2xl);
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 768px) {
  .tech-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>

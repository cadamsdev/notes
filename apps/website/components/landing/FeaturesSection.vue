<template>
  <section id="features" class="section features-section">
    <div class="container-custom">
      <div class="section-header">
        <h2 class="section-title">
          Everything You Need
        </h2>
        <p class="section-description">
          Built with modern technologies for the best note-taking experience
        </p>
      </div>

      <div class="features-grid">
        <FeatureCard 
          icon="heroicons:bolt"
          title="Performant"
          :features="[
            'Built with Tauri (Rust + Vue 3)',
            'Blazing fast startup times',
            'Fast, reliable SQLite storage'
          ]"
        />
        
        <FeatureCard 
          icon="heroicons:cube"
          title="Lightweight"
          :features="[
            'Small installation size ~5MB',
            'Minimal resource usage',
            'Runs on any modern system'
          ]"
        />
        
        <FeatureCard 
          icon="heroicons:arrow-path"
          title="Cloud Sync"
          :features="[
            'Save notes anywhere on your filesystem',
            'Works with OneDrive, Google Drive, Dropbox',
            'Your data, your control'
          ]"
        />
        
        <FeatureCard 
          icon="heroicons:document-text"
          title="Markdown Support"
          :features="[
            'Write in plain text files',
            'GitHub Flavored Markdown (GFM)',
            'Take your data anywhere'
          ]"
        />
        
        <FeatureCard 
          icon="heroicons:calendar-days"
          title="Smart Organization"
          :features="[
            'Organize with hashtags (#work, #personal)',
            'Fuzzy search with real-time filtering',
            'Quick access to any note'
          ]"
        />
        
        <FeatureCard 
          icon="heroicons:sparkles"
          title="Beautiful Design"
          :features="[
            'Clean, minimal interface',
            'Light/dark themes',
            'Mobile-responsive layout'
          ]"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.features-section {
  background-color: var(--color-white);
}

body.dark .features-section {
  background-color: var(--color-gray-900);
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

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-2xl);
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

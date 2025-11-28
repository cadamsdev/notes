<template>
  <section class="section hero-section">
    <div class="container-custom">
      <div class="hero-content">
        <div class="logo-container">
          <img src="/logo.svg" alt="NoteX Logo" class="hero-logo" />
        </div>
        <h1 class="hero-title">
          Your Notes, <span class="title-accent">Your Way</span>
        </h1>
        <p class="hero-description">
          A minimal, local-first, markdown-based note taking app. 
          Privacy-focused, blazingly fast, and works with your favorite cloud storage.
        </p>
        <div class="hero-buttons">
          <a href="#download" class="btn-hero btn-hero-primary">
            <Icon name="heroicons:arrow-down-tray" class="btn-icon" />
            Download Now
          </a>
          <a href="https://github.com/cadamsdev/notes-app" target="_blank" rel="noopener noreferrer" 
             class="btn-hero btn-hero-secondary">
            <Icon name="mdi:github" class="btn-icon" />
            View on GitHub
          </a>
        </div>
        
        <!-- Preview Images -->
        <div class="preview-container">
          <div class="preview-image-wrapper">
            <img src="/preview-light.png" alt="NoteX Light Theme" class="preview-image" />
          </div>
          <div class="preview-image-wrapper">
            <img src="/preview-dark.png" alt="NoteX Dark Theme" class="preview-image" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hero-section {
  background: linear-gradient(to bottom, var(--color-white), var(--color-gray-50));
}

body.dark .hero-section {
  background: linear-gradient(to bottom, var(--color-gray-900), var(--color-gray-800));
}

.hero-content {
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.logo-container {
  margin-bottom: var(--spacing-2xl);
}

.hero-logo {
  height: 6rem;
  width: 6rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: var(--spacing-lg);
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-lg);
}

@media (min-width: 768px) {
  .hero-title {
    font-size: var(--font-size-6xl);
  }
}

body.dark .hero-title {
  color: var(--color-white);
}

.title-accent {
  color: var(--color-primary-600);
}

.hero-description {
  font-size: var(--font-size-xl);
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-2xl);
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
}

body.dark .hero-description {
  color: var(--color-gray-300);
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  justify-content: center;
}

@media (min-width: 640px) {
  .hero-buttons {
    flex-direction: row;
  }
}

.btn-hero {
  font-size: var(--font-size-lg);
  padding: var(--spacing-md) var(--spacing-2xl);
  border-radius: var(--radius-lg);
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-base);
}

.btn-hero-primary {
  background-color: var(--color-primary-600);
  color: var(--color-white);
}

.btn-hero-primary:hover {
  background-color: var(--color-primary-700);
}

.btn-hero-secondary {
  background-color: var(--color-gray-200);
  color: var(--color-gray-900);
}

.btn-hero-secondary:hover {
  background-color: var(--color-gray-300);
}

body.dark .btn-hero-secondary {
  background-color: var(--color-gray-700);
  color: var(--color-white);
}

body.dark .btn-hero-secondary:hover {
  background-color: var(--color-gray-600);
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: inline;
  margin-right: var(--spacing-sm);
}

.preview-container {
  margin-top: var(--spacing-3xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.preview-image-wrapper {
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--color-gray-200);
}

body.dark .preview-image-wrapper {
  border-color: var(--color-gray-700);
}

.preview-image {
  width: 100%;
  display: block;
}
</style>

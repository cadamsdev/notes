<template>
  <section class="section cta-section">
    <div class="container-custom">
      <div class="cta-content">
        <h2 class="cta-title">
          Ready to Take Better Notes?
        </h2>
        <p class="cta-description">
          Join developers and writers who trust NoteX for their daily note-taking
        </p>
        <div class="cta-buttons">
          <a href="#download" class="cta-btn cta-btn-white">
            Download Now
          </a>
          <a href="https://github.com/cadamsdev/notes-app" target="_blank" rel="noopener noreferrer"
             class="cta-btn cta-btn-outlined">
            Star on GitHub ⭐
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.cta-section {
  background-color: var(--color-primary-600);
}

body.dark .cta-section {
  background-color: var(--color-primary-700);
}

.cta-content {
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  color: var(--color-white);
}

.cta-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}

.cta-description {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-2xl);
  color: var(--color-primary-100);
}

.cta-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  justify-content: center;
}

@media (min-width: 640px) {
  .cta-buttons {
    flex-direction: row;
  }
}

.cta-btn {
  padding: var(--spacing-md) var(--spacing-2xl);
  border-radius: var(--radius-lg);
  font-weight: 600;
  text-decoration: none;
  transition: background-color var(--transition-base);
  display: inline-block;
}

.cta-btn-white {
  background-color: var(--color-white);
  color: var(--color-primary-600);
}

.cta-btn-white:hover {
  background-color: var(--color-gray-100);
}

.cta-btn-outlined {
  background-color: var(--color-primary-700);
  color: var(--color-white);
  border: 1px solid var(--color-primary-500);
}

.cta-btn-outlined:hover {
  background-color: var(--color-primary-800);
}
</style>

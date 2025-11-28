<template>
  <section id="download" class="section download-section">
    <div class="container-custom">
      <div class="download-content">
        <h2 class="section-title">
          Download NoteX
        </h2>
        <p class="section-description">
          Available for Windows, macOS, and Linux
        </p>

        <div class="download-grid">
          <DownloadCard 
            platform="Windows"
            icon="mdi:microsoft-windows"
            :downloads="[
              { name: 'Windows Installer', ext: '.msi' },
              { name: 'Windows Portable', ext: '.exe' }
            ]"
          />
          
          <DownloadCard 
            platform="macOS"
            icon="mdi:apple"
            :downloads="[
              { name: 'macOS Silicon', ext: '.dmg (arm64)' },
              { name: 'macOS Intel', ext: '.dmg (x64)' }
            ]"
          />
          
          <DownloadCard 
            platform="Linux"
            icon="mdi:linux"
            :downloads="[
              { name: 'AppImage', ext: '.AppImage' },
              { name: 'Debian Package', ext: '.deb' }
            ]"
          />
        </div>

        <div class="info-box">
          <p class="info-text">
            <Icon name="heroicons:information-circle" class="info-icon" />
            Visit the 
            <a href="https://github.com/usenotex/notex/releases" target="_blank" rel="noopener noreferrer" 
               class="info-link">
              Releases page
            </a>
            for the latest version and all download options.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.download-section {
  background-color: var(--color-white);
}

body.dark .download-section {
  background-color: var(--color-gray-900);
}

.download-content {
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
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
  margin-bottom: var(--spacing-3xl);
}

body.dark .section-description {
  color: var(--color-gray-300);
}

.download-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-2xl);
}

@media (min-width: 768px) {
  .download-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.info-box {
  margin-top: var(--spacing-3xl);
  padding: var(--spacing-lg);
  background-color: var(--color-primary-50);
  border-radius: var(--radius-lg);
}

body.dark .info-box {
  background-color: rgba(2, 132, 199, 0.2);
}

.info-text {
  color: var(--color-gray-700);
}

body.dark .info-text {
  color: var(--color-gray-300);
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: inline;
  margin-right: var(--spacing-sm);
}

.info-link {
  font-weight: 600;
  color: var(--color-primary-600);
  text-decoration: none;
  transition: color var(--transition-base);
}

.info-link:hover {
  color: var(--color-primary-700);
}

body.dark .info-link {
  color: var(--color-primary-400);
}

body.dark .info-link:hover {
  color: var(--color-primary-300);
}
</style>

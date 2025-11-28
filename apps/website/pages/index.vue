<template>
  <div>
    <!-- Hero Section -->
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

    <!-- Features Section -->
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
          <!-- Feature Cards -->
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

    <!-- Tech Stack Section -->
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

    <!-- Download Section -->
    <section id="download" class="section download-section">
      <div class="container-custom">
        <div class="hero-content">
          <h2 class="section-title">
            Download NoteX
          </h2>
          <p class="section-description" style="margin-bottom: var(--spacing-3xl);">
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

    <!-- FAQ Section -->
    <section id="faq" class="section faq-section">
      <div class="container-custom">
        <div class="section-header">
          <h2 class="section-title">
            Frequently Asked Questions
          </h2>
          <p class="section-description">
            Common questions and answers about NoteX
          </p>
        </div>

        <div class="faq-container">
          <div class="faq-item">
            <h3 class="faq-question">
              <Icon name="heroicons:question-mark-circle" class="faq-icon" />
              I'm unable to install the app on macOS
            </h3>
            <div class="faq-answer">
              <p>
                Apple charges $99/year for code signing certificates. Since NoteX is a free, 
                open-source app, we don't have code signing enabled. macOS may show a warning 
                that the app is "damaged" or from an "unidentified developer."
              </p>
              <p>
                To install the DMG without issues, run this command in Terminal before opening the file:
              </p>
              <InlineCodeBlock code="xattr -d com.apple.quarantine ~/Downloads/NoteX_0.7.1_aarch64.dmg" />
              <p class="faq-note">
                <Icon name="heroicons:light-bulb" class="faq-note-icon" />
                Replace the filename with the actual DMG file you downloaded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
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
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'NoteX - Minimal, Local-first, Markdown Note Taking',
  meta: [
    { name: 'description', content: 'NoteX is a minimal, local-first, markdown-based note taking app. Privacy-focused, cross-platform, and cloud-syncable.' }
  ]
})
</script>

<style scoped>
/* Hero Section */
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

/* Section Styles */
.features-section {
  background-color: var(--color-white);
}

body.dark .features-section {
  background-color: var(--color-gray-900);
}

.tech-section {
  background-color: var(--color-gray-50);
}

body.dark .tech-section {
  background-color: var(--color-gray-800);
}

.download-section {
  background-color: var(--color-white);
}

body.dark .download-section {
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

/* CTA Section */
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

/* FAQ Section */
.faq-section {
  background-color: var(--color-gray-50);
}

body.dark .faq-section {
  background-color: var(--color-gray-800);
}

.faq-container {
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
}

.faq-item {
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-200);
}

body.dark .faq-item {
  background-color: var(--color-gray-900);
  border-color: var(--color-gray-700);
}

.faq-question {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

body.dark .faq-question {
  color: var(--color-white);
}

.faq-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-primary-600);
  flex-shrink: 0;
}

.faq-answer {
  color: var(--color-gray-600);
  line-height: 1.7;
}

body.dark .faq-answer {
  color: var(--color-gray-300);
}

.faq-answer p {
  margin-bottom: var(--spacing-md);
}

.faq-answer p:last-child {
  margin-bottom: 0;
}

.faq-note-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}
</style>

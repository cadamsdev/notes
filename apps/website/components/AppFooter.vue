<template>
  <footer class="footer">
    <div class="container-custom footer-content">
      <div class="footer-grid">
        <!-- Brand -->
        <div class="brand-section">
          <div class="brand-header">
            <img src="/logo.svg" alt="NoteX Logo" class="brand-logo" />
            <span class="brand-name">NoteX</span>
          </div>
          <p class="brand-description">
            A minimal, local-first, markdown-based note taking app.
          </p>
          <div class="social-links">
            <a href="https://github.com/cadamsdev/notes-app" target="_blank" rel="noopener noreferrer"
               class="social-link">
              <Icon name="mdi:github" class="social-icon" />
            </a>
          </div>
        </div>

        <!-- Resources -->
        <div class="footer-section">
          <h3 class="section-title">Resources</h3>
          <ul class="link-list">
            <li>
              <a href="https://github.com/cadamsdev/notes-app" target="_blank" rel="noopener noreferrer"
                 class="footer-link">
                Documentation
              </a>
            </li>
            <li>
              <a href="https://github.com/cadamsdev/notes-app/issues" target="_blank" rel="noopener noreferrer"
                 class="footer-link">
                Report Issues
              </a>
            </li>
            <li>
              <a href="https://github.com/cadamsdev/notes-app/blob/main/docs/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer"
                 class="footer-link">
                Contributing
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="footer-section">
          <h3 class="section-title">Legal</h3>
          <ul class="link-list">
            <li>
              <a href="https://github.com/cadamsdev/notes-app/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"
                 class="footer-link">
                License (GPL-3.0)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>Made with ❤️ by <a href="https://github.com/cadamsdev" target="_blank" rel="noopener noreferrer" 
           class="author-link">Chad Adams</a></p>
        <p class="copyright">© {{ currentYear }} NoteX. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background-color: var(--color-gray-50);
  border-top: 1px solid var(--color-gray-200);
}

body.dark .footer {
  background-color: var(--color-gray-900);
  border-top-color: var(--color-gray-800);
}

.footer-content {
  padding: var(--spacing-3xl) var(--spacing-md);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-2xl);
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr;
  }
}

.brand-section {
  grid-column: span 1;
}

@media (min-width: 768px) {
  .brand-section {
    grid-column: span 2;
  }
}

.brand-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.brand-logo {
  height: 2rem;
  width: 2rem;
}

.brand-name {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-gray-900);
}

body.dark .brand-name {
  color: var(--color-white);
}

.brand-description {
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-md);
}

body.dark .brand-description {
  color: var(--color-gray-400);
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
}

.social-link {
  color: var(--color-gray-600);
  transition: color var(--transition-base);
}

.social-link:hover {
  color: var(--color-gray-900);
}

body.dark .social-link {
  color: var(--color-gray-400);
}

body.dark .social-link:hover {
  color: var(--color-white);
}

.social-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.section-title {
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-md);
}

body.dark .section-title {
  color: var(--color-white);
}

.link-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.footer-link {
  color: var(--color-gray-600);
  text-decoration: none;
  transition: color var(--transition-base);
}

.footer-link:hover {
  color: var(--color-gray-900);
}

body.dark .footer-link {
  color: var(--color-gray-400);
}

body.dark .footer-link:hover {
  color: var(--color-white);
}

.footer-bottom {
  margin-top: var(--spacing-3xl);
  padding-top: var(--spacing-2xl);
  border-top: 1px solid var(--color-gray-200);
  text-align: center;
  color: var(--color-gray-600);
}

body.dark .footer-bottom {
  border-top-color: var(--color-gray-800);
  color: var(--color-gray-400);
}

.author-link {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-base);
}

.author-link:hover {
  color: var(--color-gray-900);
}

body.dark .author-link:hover {
  color: var(--color-white);
}

.copyright {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
}
</style>

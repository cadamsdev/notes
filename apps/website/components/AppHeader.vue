<template>
  <header class="header">
    <nav class="container-custom">
      <div class="nav-content">
        <!-- Logo -->
        <NuxtLink to="/" class="logo">
          <img src="/logo.svg" alt="NoteX Logo" class="logo-image" />
          <span class="logo-text">NoteX</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="desktop-nav">
          <NuxtLink to="#features" class="nav-link">
            Features
          </NuxtLink>
          <NuxtLink to="#download" class="nav-link">
            Download
          </NuxtLink>
          <a href="https://github.com/cadamsdev/notes-app" target="_blank" rel="noopener noreferrer" 
             class="nav-link">
            GitHub
          </a>
          <NuxtLink to="#download" class="btn-primary">
            Get Started
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-menu-button">
          <Icon :name="mobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" class="icon" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <NuxtLink to="#features" class="mobile-link">
          Features
        </NuxtLink>
        <NuxtLink to="#download" class="mobile-link">
          Download
        </NuxtLink>
        <a href="https://github.com/cadamsdev/notes-app" target="_blank" rel="noopener noreferrer"
           class="mobile-link">
          GitHub
        </a>
        <NuxtLink to="#download" class="btn-primary mobile-btn">
          Get Started
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-gray-200);
}

body.dark .header {
  background-color: rgba(17, 24, 39, 0.8);
  border-bottom-color: var(--color-gray-800);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
}

.logo-image {
  height: 2rem;
  width: 2rem;
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-gray-900);
}

body.dark .logo-text {
  color: var(--color-white);
}

.desktop-nav {
  display: none;
  align-items: center;
  gap: var(--spacing-2xl);
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }
}

.nav-link {
  color: var(--color-gray-600);
  text-decoration: none;
  transition: color var(--transition-base);
}

.nav-link:hover {
  color: var(--color-gray-900);
}

body.dark .nav-link {
  color: var(--color-gray-300);
}

body.dark .nav-link:hover {
  color: var(--color-white);
}

.btn-primary {
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-primary-600);
  color: var(--color-white);
  font-weight: 500;
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: background-color var(--transition-base);
  display: inline-block;
  text-align: center;
}

.btn-primary:hover {
  background-color: var(--color-primary-700);
}

.btn-primary:active {
  background-color: var(--color-primary-800);
}

.mobile-menu-button {
  display: block;
  padding: var(--spacing-sm);
  color: var(--color-gray-600);
  background: none;
  border: none;
  cursor: pointer;
  transition: color var(--transition-base);
}

.mobile-menu-button:hover {
  color: var(--color-gray-900);
}

body.dark .mobile-menu-button {
  color: var(--color-gray-300);
}

@media (min-width: 768px) {
  .mobile-menu-button {
    display: none;
  }
}

.mobile-menu-button .icon {
  width: 1.5rem;
  height: 1.5rem;
}

.mobile-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0;
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}

.mobile-link {
  display: block;
  color: var(--color-gray-600);
  text-decoration: none;
  transition: color var(--transition-base);
}

.mobile-link:hover {
  color: var(--color-gray-900);
}

body.dark .mobile-link {
  color: var(--color-gray-300);
}

body.dark .mobile-link:hover {
  color: var(--color-white);
}

.mobile-btn {
  width: 100%;
}
</style>

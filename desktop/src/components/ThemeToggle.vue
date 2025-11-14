<script setup lang="ts">
import { ref, onMounted } from 'vue';

type Theme = 'light' | 'dark';

const theme = ref<Theme>('dark');

const applyTheme = (themeValue: Theme) => {
  if (themeValue === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
};

// Initialize theme from localStorage or system preference
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;

  if (savedTheme) {
    theme.value = savedTheme;
  } else {
    // Detect system preference
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    theme.value = prefersDark ? 'dark' : 'light';
  }

  applyTheme(theme.value);
});

const toggleTheme = () => {
  // Toggle between light and dark
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme.value);
  applyTheme(theme.value);
};

const getThemeLabel = () => {
  return theme.value === 'light' ? 'Light mode' : 'Dark mode';
};
</script>

<template>
  <button @click="toggleTheme" class="theme-toggle" :title="getThemeLabel()">
    <!-- Sun Icon (Light Mode) -->
    <svg
      v-if="theme === 'light'"
      class="theme-icon theme-icon-light"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
      />
    </svg>

    <!-- Moon Icon (Dark Mode) -->
    <svg
      v-else
      class="theme-icon theme-icon-dark"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        fill-rule="evenodd"
        d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  padding: 0.75rem;
  border-radius: 0.75rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: all 0.2s;
}

.theme-toggle:hover {
  transform: scale(1.05);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text-primary);
  transition: all 0.3s;
}

.theme-icon-light:hover {
  transform: rotate(45deg);
}

.theme-icon-dark:hover {
  transform: rotate(-12deg);
}

.theme-icon-system:hover {
  transform: scale(1.1);
}
</style>

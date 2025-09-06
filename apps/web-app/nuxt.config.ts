// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@pinia/nuxt', '@vueuse/nuxt'],
  css: ['@/assets/css/styles.css'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'http://localhost:3001',
    },
  },
  app: {
    head: {
      title: 'Notes',
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png',
        },
      ],
    },
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            // Text colors - X-like refined contrast
            text: '#e7e9ea',
            'text-primary': '#f7f9fa',
            'text-primary-hover': '#ffffff',
            'text-primary-emphasis': '#ffffff',
            'text-secondary': '#71767b',
            'text-secondary-hover': '#8b949e',
            'text-muted': '#536471',
            'text-link': '#1d9bf0',

            // Background colors - X modern dark theme
            bg: '#000000',
            'bg-hover': '#0f1419',
            'bg-secondary': '#16181c',
            'bg-secondary-hover': '#1e2025',
            'bg-tertiary': '#202327',
            'bg-border': '#2f3336',
            'bg-border-hover': '#3e4144',

            // Primary colors - X signature blue with refinements
            primary: '#1d9bf0',
            'primary-hover': '#1a8cd8',
            'primary-soft': 'rgba(29, 155, 240, 0.1)',
            'primary-muted': 'rgba(29, 155, 240, 0.2)',

            // Secondary colors - refined grays
            secondary: '#536471',
            'secondary-hover': '#6e767d',
            'secondary-soft': 'rgba(83, 100, 113, 0.1)',

            // Status colors - X modern palette
            success: '#00ba7c',
            'success-hover': '#00a372',
            error: '#f4212e',
            'error-hover': '#dc1927',
            warning: '#ffad1f',
            'warning-hover': '#e6981c',

            // Component-specific
            accent: '#1d9bf0',
            focus: '#1d9bf0',

            // Tag colors - X-inspired modern palette
            'tag-blue': '#1d9bf0',
            'tag-purple': '#7856ff',
            'tag-green': '#00ba7c',
            'tag-red': '#f4212e',
            'tag-yellow': '#ffad1f',
            'tag-orange': '#ff6500',
            'tag-pink': '#e91e63',
            'tag-cyan': '#1ba1f2',
            'tag-indigo': '#6366f1',
            'tag-emerald': '#10b981',
            'tag-rose': '#f43f5e',
            'tag-amber': '#f59e0b',
            'tag-gray': '#6b7280',
            'tag-slate': '#64748b',
            'tag-default-text': '#ffffff',

            // UI component tokens
            'modal-overlay': 'rgba(0, 0, 0, 0.65)',
            'btn-text': '#ffffff',
            'input-bg': '#202327',
            'input-border': '#2f3336',
            'card-bg': '#16181c',
            'card-border': '#2f3336',
            'divider': '#2f3336',
            
            // Scrollbar - X-like subtle styling
            'scrollbar-track': 'transparent',
            'scrollbar-thumb': '#536471',
            'scrollbar-thumb-hover': '#6e767d',
          },
        },
      },
    },
  },
});

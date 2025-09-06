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
            // Text colors - optimized for reading and writing
            text: '#e8eaed',
            'text-primary': '#f8f9fa',
            'text-primary-hover': '#ffffff',
            'text-primary-emphasis': '#ffffff',
            'text-secondary': '#9aa0a6',
            'text-secondary-hover': '#bdc1c6',
            'text-muted': '#5f6368',
            'text-link': '#8ab4f8',

            // Background colors - clean and minimal
            bg: '#0d1117',
            'bg-hover': '#161b22',
            'bg-secondary': '#21262d',
            'bg-secondary-hover': '#30363d',
            'bg-tertiary': '#373e47',
            'bg-border': '#30363d',
            'bg-border-hover': '#444c56',

            // Primary colors - subtle blue for focus
            primary: '#58a6ff',
            'primary-hover': '#388bfd',
            'primary-soft': 'rgba(88, 166, 255, 0.1)',
            'primary-muted': 'rgba(88, 166, 255, 0.2)',

            // Secondary colors - neutral grays
            secondary: '#656d76',
            'secondary-hover': '#7d8590',
            'secondary-soft': 'rgba(101, 109, 118, 0.1)',

            // Status colors - subtle and professional
            success: '#3fb950',
            'success-hover': '#2ea043',
            error: '#f85149',
            'error-hover': '#da3633',
            warning: '#d29922',
            'warning-hover': '#bb8009',

            // Component-specific
            accent: '#58a6ff',
            focus: '#58a6ff',

            // Tag colors - muted professional palette
            'tag-blue': '#58a6ff',
            'tag-purple': '#a5a5ff',
            'tag-green': '#3fb950',
            'tag-red': '#f85149',
            'tag-yellow': '#d29922',
            'tag-orange': '#fd7e14',
            'tag-pink': '#db61a2',
            'tag-cyan': '#39c5cf',
            'tag-indigo': '#6f7fff',
            'tag-emerald': '#26d0ce',
            'tag-rose': '#ff6b9d',
            'tag-amber': '#f7cc47',
            'tag-gray': '#7d8590',
            'tag-slate': '#8b949e',
            'tag-default-text': '#ffffff',

            // UI component tokens - professional and clean
            'modal-overlay': 'rgba(1, 4, 9, 0.8)',
            'btn-text': '#f0f6fc',
            'input-bg': '#21262d',
            'input-border': '#30363d',
            'input-focus': '#388bfd',
            'card-bg': '#161b22',
            'card-border': '#21262d',
            'card-hover': '#21262d',
            'divider': '#21262d',
            'editor-bg': '#0d1117',
            'editor-border': '#21262d',
            
            // Scrollbar - minimal and unobtrusive
            'scrollbar-track': 'transparent',
            'scrollbar-thumb': '#373e47',
            'scrollbar-thumb-hover': '#444c56',
          },
        },
      },
    },
  },
});

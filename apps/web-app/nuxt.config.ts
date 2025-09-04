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
      title: 'NoteX',
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
            // Text colors - improved contrast
            text: '#f7f9fa',
            'text-primary': '#e7e9ea',
            'text-primary-hover': '#f7f9fa',
            'text-primary-emphasis': '#ffffff',
            'text-secondary': '#71767b',
            'text-secondary-hover': '#8b949e',
            'text-link': '#1d9bf0',

            // Background colors - more modern dark theme
            bg: '#000000',
            'bg-hover': '#080808',
            'bg-secondary': '#16181c',
            'bg-secondary-hover': '#1e2328',
            'bg-on-secondary': '#202327',

            // Border colors
            'bg-border': '#2f3336',

            // Primary colors - Twitter-like blue
            primary: '#1d9bf0',
            'primary-hover': '#1a8cd8',
            secondary: '#536471',
            'secondary-hover': '#6e767d',
            accent: '#1d9bf0',
            focus: '#1d9bf0',

            // Tag colors - more vibrant and modern
            'tag-blue': '#1d9bf0',
            'tag-purple': '#7856ff',
            'tag-green': '#00ba7c',
            'tag-red': '#f4212e',
            'tag-yellow': '#ffad1f',
            'tag-orange': '#ff6500',
            'tag-pink': '#e91e63',
            'tag-cyan': '#1ba1f2',
            'tag-dark-gray': '#536471',
            'tag-light-gray': '#8b949e',
            'tag-brown': '#8b5a2b',
            'tag-default-text': '#f7f9fa',

            // Component tokens
            'modal-overlay': 'rgba(0, 0, 0, 0.6)',
            'btn-text': '#ffffff',
            'scrollbar-track': '#202327',
            'scrollbar-thumb': '#536471',
            'scrollbar-thumb-hover': '#6e767d',
          },
        },
      },
    },
  },
});

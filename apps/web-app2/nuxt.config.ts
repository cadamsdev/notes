// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  css: ['@/assets/css/styles.css'],
  runtimeConfig: {
    public: {
      apiUrl: ''
    }
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            // Text colors
            text: '#e2e2e2',
            'text-primary': '#b3b3b3',
            'text-primary-hover': '#d9d9d9',
            'text-primary-emphasis': '#e6e6e6',
            'text-secondary': '#b3b3b3',
            'text-secondary-hover': '#c6c6c6',
            'text-link': '#e6e6e6',

            // Background colors
            bg: '#151415',
            'bg-hover': '#2d2b2d',
            'bg-secondary': '#211f21',
            'bg-secondary-hover': '#454245',
            'bg-on-secondary': '#2d2b2d',

            // Border colors
            'bg-border': '#2d2b2d',

            // Other colors
            primary: '#e78e1e',
            'primary-hover': '#eb9f40',
            secondary: '#a39995',
            'secondary-hover': '#b1a8a5',
            accent: '#E8942A',
            focus: '#454245',

            // Tag colors
            'tag-blue': '#004c91',
            'tag-purple': '#4d2b8a',
            'tag-green': '#1f6e32',
            'tag-red': '#a61c2a',
            'tag-yellow': '#c68f00',
            'tag-orange': '#c24a0a',
            'tag-pink': '#b82d6a',
            'tag-cyan': '#0e7d8a',
            'tag-dark-gray': '#24282b',
            'tag-light-gray': '#d4d6d7',
            'tag-brown': '#5e3f34',
            'tag-default-text': '#e2e2e2',

            // Component tokens
            'modal-overlay': 'rgb(21, 20, 21, 0.75)',
            'btn-text': '#151415',
            'scrollbar-track': '#2c2a2c',
            'scrollbar-thumb': '#383538',
            'scrollbar-thumb-hover': '#433f43',
          },
        },
      },
    },
  },
});

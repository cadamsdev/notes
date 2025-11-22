// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  // Enable SSG mode
  ssr: true,
  
  modules: [
    '@nuxt/icon',
    '@vueuse/nuxt'
  ],

  app: {
    head: {
      title: 'NoteX - Minimal, Local-first, Markdown Note Taking',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'NoteX is a minimal, local-first, markdown-based note taking app. Privacy-focused, cross-platform, and cloud-syncable.' 
        },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:title', content: 'NoteX - Minimal Note Taking App' },
        { property: 'og:description', content: 'Local-first, privacy-focused note taking with markdown support' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'NoteX - Minimal Note Taking App' },
        { name: 'twitter:description', content: 'Local-first, privacy-focused note taking with markdown support' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    prerender: {
      routes: ['/']
    }
  }
})

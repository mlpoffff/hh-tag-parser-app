// https://nuxt.com/docs/api/configuration/nuxt-config
const buildMode = process.env.BUILD_MODE


export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  app: {
    head: {
      title: 'Парсер тегов hh.ru'
    }
  },

  devtools: {
    enabled: true
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: ''
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})

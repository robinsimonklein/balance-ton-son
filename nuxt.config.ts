// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },

  runtimeConfig: {
    downloadPath: process.env.NUXT_DOWNLOAD_PATH,
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    },
  },

  routeRules: {
    '/admin/**': {
      ssr: false,
    },
  },

  modules: ['@nuxt/eslint', '@nuxt/ui', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],

  ui: {
    colorMode: false,
  },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },

  runtimeConfig: {
    downloadPath: process.env.NUXT_DOWNLOAD_PATH,
    supabaseServiceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,
    public: {
      isAdmin: process.env.NUXT_PUBLIC_IS_ADMIN || 'false',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    },
  },

  routeRules: {
    '/admin/**': {
      ssr: false,
      appMiddleware: 'admin',
    },
  },

  modules: ['@nuxt/eslint', '@nuxt/ui', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],

  ui: {
    colorMode: false,
  },
});

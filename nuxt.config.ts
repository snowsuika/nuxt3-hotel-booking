// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@200..900&display=swap'
        }
      ]
    }
  },
  css: ['@/assets/stylesheets/all.scss'],
  modules: ['@nuxt/icon', '@vee-validate/nuxt','@pinia/nuxt'],
  veeValidate: {
    componentNames: {
      Form: "VForm",
      Field: "VField",
      ErrorMessage: "VErrorMessage",
    },
  },
});

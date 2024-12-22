// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3005/api/v1'
    }
  },
  devtools: { enabled: true },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '享樂酒店 | Enjoyment Luxury Hotel',
      meta: [
        {
          'http-equiv': 'X-UA-Compatible',
          content: 'IE=edge'
        },
        {
          'http-equiv': 'X-Content-Type-Options',
          content: 'nosniff'
        },
        {
          name: 'author',
          content: '享樂酒店'
        },
        {
          name: 'keywords',
          content:
            '享樂酒店 訂房,高雄旅遊,訂房,住宿,住宿預訂,四人房,雙人房,景觀房'
        },
        {
          name: 'description',
          content:
            '享樂酒店 旅館位於高雄，提供頂級的住宿體驗。享受絕美市景與高級設施，讓您的每一刻都充滿奢華與舒適。立即預訂，開啟難忘的住宿之旅！'
        },
        {
          name: 'theme-color',
          content: '#ffffff'
        },
        {
          name: 'robots',
          content: 'index, follow'
        },
        {
          property: 'fb:app_id',
          content: '12345678'
        },
        {
          property: 'og:locale',
          content: 'zh-TW'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:url',
          content: 'https://freyja.travel.com.tw'
        },
        {
          property: 'og:title',
          content: '享樂酒店 | 高雄頂級旅館 - 提供奢華住宿體驗'
        },
        {
          property: 'og:image',
          content: 'https://freyja.travel.com.tw/images/og-image.jpg'
        },
        {
          property: 'og:description',
          content:
            '享樂酒店 旅館位於高雄，提供頂級的住宿體驗。享受絕美市景與高級設施，讓您的每一刻都充滿奢華與舒適。立即預訂，開啟難忘的住宿之旅！'
        }
      ],
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
  modules: ['@nuxt/icon', '@vee-validate/nuxt', '@pinia/nuxt'],
  veeValidate: {
    componentNames: {
      Form: 'VForm',
      Field: 'VField',
      ErrorMessage: 'VErrorMessage'
    }
  }
});

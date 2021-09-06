const fs = require('fs')

export default {
  target: 'server',
  
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    NUXT_ENV_GRAPHQL_URI: process.env.NUXT_ENV_GRAPHQL_URI,
    NUXT_ENV_GRAPHQLWS_URI: process.env.NUXT_ENV_GRAPHQLWS_URI,
    NUXT_ENV_GUEST_TOKEN: process.env.NUXT_ENV_GUEST_TOKEN,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s',
    htmlAttrs: {
      lang: 'en',
      'data-theme': 'light'
    },
    bodyAttrs: {
      class: process.env.NODE_ENV !== 'production' ? 'debug-screens' : ''
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/helper.js' },
    { src: '@/plugins/event-bus.js' },
    { src: '@/plugins/img-lazyload.js', mode: 'client' },
    { src: '@/plugins/vue-filters.js' },
    { src: '@/plugins/webstorage.js', mode: 'client' },
    { src: '@/plugins/axios.js' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    ['@nuxtjs/moment', {
      defaultLocale: 'vi',
      locales: ['vi'],
      plugins: [
        'moment-duration-format'
      ]
    }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/apollo',
    '@nuxtjs/axios',
    ['cookie-universal-nuxt', { alias: 'cookiz' }]
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: [
      'axios'
    ],
  },

  router: {
    middleware: ['init'],
  },

  apollo: {
    includeNodeModules: true,
    clientConfigs: {
      default: '~/gql/clientConfig.ts'
    }
  },

  tailwindcss: {
    jit: true
  }
}

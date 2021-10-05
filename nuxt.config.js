const fs = require('fs')

export default {
  target: 'server',
  
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    NUXT_ENV_GRAPHQL_URI: process.env.NUXT_ENV_GRAPHQL_URI,
    NUXT_ENV_GRAPHQLWS_URI: process.env.NUXT_ENV_GRAPHQLWS_URI,
    NUXT_ENV_GUEST_TOKEN: process.env.NUXT_ENV_GUEST_TOKEN,
    NUXT_ENV_STORAGE_ENDPOINT: process.env.NUXT_ENV_STORAGE_ENDPOINT,
    NUXT_ENV_S3_ENDPOINT: process.env.NUXT_ENV_S3_ENDPOINT,
    NUXT_ENV_MEILISEARCH_URL: process.env.NUXT_ENV_MEILISEARCH_URL,
    NUXT_ENV_MEILISEARCH_API_KEY: process.env.NUXT_ENV_MEILISEARCH_API_KEY,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | Tiệm của tui',
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
    '@/assets/bootstrap.min.css',
    '@/assets/fonts/font-awesome/css/font-awesome.min.css',
    '@/assets/global.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/antd-ui.js' },
    { src: '@/plugins/helper.js' },
    { src: '@/plugins/event-bus.js' },
    { src: '@/plugins/img-lazyload.js', mode: 'client' },
    { src: '@/plugins/vue-filters.js' },
    { src: '@/plugins/webstorage.js', mode: 'client' },
    { src: '@/plugins/axios.js' },
    { src: '@/plugins/zk-table.js', mode: 'client' },
    { src: '@/plugins/filepond.js', mode: 'client' },
    { src: '@/plugins/tui-editor.js', mode: 'client' },
    { src: '@/plugins/vue-autocomplete.js', mode: 'client' },
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
    // publicPath: '/_smstore_site/',
    'html.minify': {
      collapseBooleanAttributes: true,
      decodeEntities: true,
      minifyCSS: true,
      minifyJS: true,
      processConditionalComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      trimCustomFragments: true,
      useShortDoctype: true
    },
    optimizeCSS: true,
    parallel: true,
    babel: {
      presets: ['@vue/babel-preset-jsx'],
      plugins: [
        ["import", {
          "libraryName": "antd",
          "style": true,   // or 'css'
        }]
      ]
    }
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
  },

  hooks: {
    render: {
      errorMiddleware(app) {
        app.use((error, req, res, next) => {
          console.log(error);
          console.log(res);
          // res.writeHead(307, {
          //   Location: '/network-error',
          // })
          // res.end()
        })
      },
    },
  },
}

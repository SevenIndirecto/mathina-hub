const IS_DEV = process.env.NODE_ENV !== 'production';
const createResolver = require('postcss-import-resolver');
const path = require('path');
const srcDir = path.join(__dirname, 'src');
const rootDir = __dirname;

export default {
  // mode: 'spa',
  // target: 'spa',
  ssr: false,
  target: 'static',
  env: {
    IS_DEV,
    BASE_URL: IS_DEV ? 'http://localhost:3000' : 'https://dev.zabkar.net'
  },

  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { 'http-equiv': 'Content-Security-Policy', content: 'upgrade-insecure-requests' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#c2d9e9', throttle: 0 },
  /*
  ** Global CSS
  */
  css: ['~/assets/styles/main.pcss'],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    [
      'nuxt-i18n', {
        // vueI18nLoader: true
      }
    ]
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.BASE_URL,
  },
  i18n: {
    locales: [
      // ISO 639-1
      { code: 'en', file: 'en.js', name: 'English' },
      { code: 'de', file: 'de.js', name: 'Deutsch' },
      { code: 'sl', file: 'sl.js', name: 'Slovensko' }
    ],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en'
    },
    langDir: 'i18n/',
    lazy: true,
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // TODO: Not sure if we need .yaml webpack loader support if loading stories via ajax
      config.resolve.extensions.push('.yaml');
      config.module.rules.push({
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader',
      });
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      });
      // TODO: If we want to load .md files at build time, but current method loads async
      // config.module.rules.push({
      //   test: /\.md$/,
      //   loaders: [
      //     'vue-loader',
      //     {
      //       loader: 'vue-md-loader',
      //       options: {
      //         plugins: [
      //           // require('markdown-it-html5-media'),
      //           require('markdown-it-table-of-contents'),
      //         ]
      //         // your preferred options
      //       }
      //     }
      //   ],
      // });
    },
    postcss: {
      plugins: {
        // https://github.com/postcss/postcss-import
        'postcss-import': {
          // With current settings required to use "./" in css files (eg. @import "./_variables.css")
          resolve: createResolver({
            alias: {
              '~': srcDir,
              '~~': rootDir,
              '@': srcDir,
              '@@': rootDir,
            },
            modules: [srcDir, rootDir],
          }),
        },
        // https://github.com/postcss/postcss-url
        'postcss-url': {},
        // https://github.com/postcss/postcss-nested
        // Works better for forming BEM class names than postscss-nesting
        'postcss-nested': {},
        // https://github.com/MadLittleMods/postcss-css-variables
        'postcss-css-variables': {
          'preserve': true
        },
        'postcss-hexrgba': {},
        // https://github.com/csstools/postcss-preset-env
        'postcss-preset-env': {
          stage: 3,
          features: {
            'custom-media-queries': true,
            'color-mod-function': true,
          }
        },
      },
    }
  }
};

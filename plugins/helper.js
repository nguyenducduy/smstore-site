const slugify = require('slugify');

const helper = {
  env: {},

  getImage(path) {
    return this.env.NUXT_ENV_S3_ENDPOINT + '/' + path
  },

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  },

  getSlug(title) {
    return slugify(title, { lower: true, locale: 'vi' })
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default ({ $config }, inject) => {
  helper.env = $config;

  inject('helper', helper);
}
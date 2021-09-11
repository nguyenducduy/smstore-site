const slugify = require('slugify');

const helper = {
  env: {},

  getCover(path, size='thumb_320x320_') {
    let output = '';

    if (path !== null && typeof path !== 'undefined' && path !== '') {
      const head = path.substr(0, path.lastIndexOf('/'));    
      const tail = path.replace(/^.*[\\\/]/, '');

      output = 'https://'
        + this.env.NUXT_ENV_GCS_URI
        + this.env.NUXT_ENV_GCS_BUCKET + '/'
        + head + '/'
        + size
        + tail;
    }
    
    return output;
  },

  getAvatar(path) {
    let output = '';

    if (path !== null && typeof path !== 'undefined' && path !== '') {
      output = 'https://'
        + this.env.NUXT_ENV_GCS_URI
        + this.env.NUXT_ENV_GCS_BUCKET + '/'
        + path;
    }
    
    return output;
  },

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  },

  getSlug(title) {
    return slugify(title, { lower: true, locale: 'vi' })
  }
}

export default ({ $config }, inject) => {
  helper.env = $config;

  inject('helper', helper);
}
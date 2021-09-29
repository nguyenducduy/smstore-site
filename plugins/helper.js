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
  },

  replaceBRWithEmptyBlock(html) {
    const TAG_NAME = '[A-Za-z][A-Za-z0-9-]*';
    const ATTRIBUTE_NAME = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
    const UNQUOTED_VALUE = '[^"\'=<>`\\x00-\\x20]+';

    const SINGLE_QUOTED_VALUE = "'[^']*'";
    const DOUBLE_QUOTED_VALUE = '"[^"]*"';

    const ATTRIBUTE_VALUE = `(?:${UNQUOTED_VALUE}|${SINGLE_QUOTED_VALUE}|${DOUBLE_QUOTED_VALUE})`;
    const ATTRIBUTE_VALUE_SPEC = `${'(?:\\s*=\\s*'}${ATTRIBUTE_VALUE})`;

    const ATTRIBUTE = `${'(?:\\s+'}${ATTRIBUTE_NAME}${ATTRIBUTE_VALUE_SPEC}?)`;

    const OPEN_TAG = `<(${TAG_NAME})(${ATTRIBUTE})*\\s*/?>`;
    const CLOSE_TAG = `</(${TAG_NAME})\\s*[>]`;

    const HTML_TAG = `(?:${OPEN_TAG}|${CLOSE_TAG})`;

    const reBR = /<br\s*\/*>/i;

    const ALTERNATIVE_TAG_FOR_BR = '</p><p>';

    // remove br in paragraph to compatible with markdown
    let replacedHTML = html.replace(/<p><br\s*\/*><\/p>/gi, '<p></p>');
    const reHTMLTag = new RegExp(HTML_TAG, 'ig');
    const htmlTagMatched = replacedHTML.match(reHTMLTag);

    if (htmlTagMatched !== null) {
      htmlTagMatched.forEach((htmlTag, index) => {
        if (reBR.test(htmlTag)) {
          let alternativeTag = ALTERNATIVE_TAG_FOR_BR;

          if (index) {
            const prevTag = htmlTagMatched[index - 1];
            const openTagMatched = prevTag.match(OPEN_TAG);

            if (openTagMatched && !/br/i.test(openTagMatched[1])) {
              const [, tagName] = openTagMatched;

              alternativeTag = `</${tagName}><${tagName}>`;
            }
          }
          replacedHTML = replacedHTML.replace(reBR, alternativeTag);
        }
      });
    }    

    return replacedHTML;
  },
}

export default ({ $config }, inject) => {
  helper.env = $config;

  inject('helper', helper);
}
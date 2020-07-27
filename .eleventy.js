const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const Terser = require('terser');

const htmlmin = require('./src/utils/minify-html.js');

module.exports = (config) => {
  config.addLayoutAlias('default', 'layouts/base.njk');

  if (process.env.ELEVENTY_ENV === 'production') {
    config.addTransform('htmlmin', htmlmin);
  }

  config.addFilter('jsmin', (code) => {
    const minified = Terser.minify(code);

    if (minified.error) {
      console.log('Terser error: ', minified.error);

      return code;
    }

    return minified.code;
  });

  config.addPassthroughCopy('./src/assets/videos');
  config.addPassthroughCopy('./src/assets/images');
  config.addPassthroughCopy('./src/assets/fonts');

  config.addWatchTarget('./src/assets/');

  config.addPlugin(eleventyNavigationPlugin);

  return {
    dir: {
      input: 'src/',
      output: 'public/',
      data: `_data/`,
    },
    templateFormats: ['njk', '11ty.js'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true,
  };
};

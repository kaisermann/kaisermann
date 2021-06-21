require('dotenv/config');

const navigationPlugin = require('@11ty/eleventy-navigation');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const Terser = require('terser');

const { plugin: assetManager } = require('./src/utils/assetManager');

module.exports = (config) => {
  config.addLayoutAlias('default', 'layouts/base.njk');

  config.addNunjucksAsyncFilter('jsmin', async (code, callback) => {
    const minified = await Terser.minify(code);

    if (minified.error) {
      console.log('Terser error: ', minified.error);

      return callback(minified.error, code);
    }

    callback(null, minified.code);
  });

  config.addPassthroughCopy('./src/assets/videos');
  config.addPassthroughCopy('./src/assets/images');
  config.addPassthroughCopy('./src/assets/fonts');
  config.addPassthroughCopy('./src/_redirects');

  config.addWatchTarget('./src/assets/');

  config.addPlugin(navigationPlugin);
  config.addPlugin(pluginRss);
  config.addPlugin(assetManager);

  return {
    dir: {
      input: 'src/',
      output: 'public/',
      data: `_data/`,
    },
    templateFormats: ['njk', '11ty.js', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true,
  };
};

require('dotenv/config');
const path = require('path');

const navigationPlugin = require('@11ty/eleventy-navigation');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const Terser = require('terser');

const htmlmin = require('./src/utils/minify-html.js');

module.exports = (config) => {
  config.addLayoutAlias('default', 'layouts/base.njk');

  if (process.env.ELEVENTY_ENV === 'production') {
    config.addTransform('htmlmin', htmlmin);
  }

  config.addNunjucksAsyncFilter('jsmin', async (code, callback) => {
    const minified = await Terser.minify(code);

    if (minified.error) {
      console.log('Terser error: ', minified.error);

      return callback(minified.error, code);
    }

    callback(null, minified.code);
  });

  config.addFilter('asset', function assetFilter(fileName) {
    // if passed path is not absolute, consider it relative to the page url
    const absolutePath = !path.isAbsolute(fileName)
      ? path.join(
          '/',
          path.relative('src', path.dirname(this.ctx.page.inputPath)),
          fileName,
        )
      : fileName;

    const foundAsset = this.ctx.assets.find((asset) => {
      return asset.fileName === absolutePath;
    });

    if (foundAsset == null) {
      console.warn(`Could not find asset "${fileName}".`);

      return '';
    }

    return foundAsset.publicUrl;
  });

  config.addPassthroughCopy('./src/assets/videos');
  config.addPassthroughCopy('./src/assets/images');
  config.addPassthroughCopy('./src/assets/fonts');
  config.addPassthroughCopy('./src/_redirects');
  // config.addPassthroughCopy('./src/lab/**/*.{css,js}');

  config.addWatchTarget('./src/assets/');

  config.addPlugin(navigationPlugin);
  config.addPlugin(pluginRss);

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

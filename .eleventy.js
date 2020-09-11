require('dotenv/config');

const { readFile } = require('fs/promises');
const { join } = require('path');

const navigationPlugin = require('@11ty/eleventy-navigation');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const Terser = require('terser');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');

const htmlmin = require('./src/utils/minify-html.js');

module.exports = (config) => {
  config.addLayoutAlias('default', 'layouts/base.njk');

  if (process.env.ELEVENTY_ENV === 'production') {
    config.addTransform('htmlmin', htmlmin);
  }

  config.addNunjucksAsyncShortcode('postcss', async (path) => {
    const { plugins } = postcssrc.sync();

    path = join(process.cwd(), 'src', path);
    const css = (await readFile(path)).toString();

    return postcss(plugins)
      .process(css, { from: path })
      .then((result) => result.css);
  });

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

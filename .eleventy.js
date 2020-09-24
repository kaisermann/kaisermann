require('dotenv/config');
const navigationPlugin = require('@11ty/eleventy-navigation');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const eleventySvelte = require('eleventy-plugin-svelte');
const Terser = require('terser');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const replace = require('@rollup/plugin-replace');
const postcss = require('rollup-plugin-postcss');

const svelteConfig = require('./svelte.config.js');
const htmlmin = require('./src/utils/minify-html.js');

const PROD = process.env.ELEVENTY_ENV === 'production';

// const ASSETS_DIR = join(process.cwd(), 'public', 'assets');

const plugins = [
  replace({
    'process.env.ELEVENTY_ENV': JSON.stringify(process.env.ELEVENTY_ENV),
  }),
  nodeResolve(),
  commonjs(),
  postcss({ extract: 'styles.css' }),
  PROD && terser(),
];

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

  config.addPassthroughCopy('./src/assets/videos');
  config.addPassthroughCopy('./src/assets/images');
  config.addPassthroughCopy('./src/assets/fonts');
  config.addPassthroughCopy('./src/_redirects');

  config.addWatchTarget('./src/assets/');

  config.addPlugin(navigationPlugin);
  config.addPlugin(pluginRss);

  config.addPlugin(eleventySvelte, {
    rollupPluginSvelteSSROptions: {
      ...svelteConfig,
    },
    rollupPluginSvelteClientOptions: {
      ...svelteConfig,
      emitCss: true,
    },
    rollupClientPlugins: plugins,
    clientLegacyOutput: false,
  });

  return {
    dir: {
      input: 'src/',
      output: 'public/',
      data: `_data/`,
    },
    templateFormats: ['11ty.js', 'svelte'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true,
  };
};

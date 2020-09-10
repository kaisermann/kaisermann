/* eslint-disable global-require */
const { join, dirname } = require('path');
const { writeFileSync, mkdirSync } = require('fs');

const rollup = require('rollup');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const svelte = require('rollup-plugin-svelte');
const preprocess = require('svelte-preprocess');
const replace = require('@rollup/plugin-replace');
const postcss = require('rollup-plugin-postcss');

const PROD = process.env.ELEVENTY_ENV === 'production';

const ASSETS_DIR = join(process.cwd(), 'public', 'assets');
const STYLES_DIR = join(ASSETS_DIR, 'styles');

const plugins = [
  replace({
    'process.env.ELEVENTY_ENV': JSON.stringify(process.env.ELEVENTY_ENV),
  }),
  nodeResolve(),
  commonjs(),
  svelte({
    preprocess: preprocess({
      defaults: {
        css: 'postcss',
      },
      postcss: true,
    }),
    emitCss: true,
  }),
  postcss({ extract: 'deferred.css' }),
  // PROD && terser(),
];

module.exports = class {
  async data() {
    const rawFilepath = join(__dirname, 'scripts', 'main.js');

    return {
      rawFilepath,
      permalink: 'assets/scripts/main.js',
    };
  }

  async render({ rawFilepath }) {
    const inputOptions = {
      input: rawFilepath,
      plugins,
    };

    const outputOptions = {
      sourcemap: false,
      format: 'es',
      name: 'main',
      dir: 'dist/',
    };

    const bundle = await rollup.rollup(inputOptions);
    const { output } = await bundle.generate(outputOptions);

    const code = [];

    for (const chunkOrAsset of output) {
      if (chunkOrAsset.type === 'chunk') {
        code.push([chunkOrAsset.code]);
      } else {
        const asset = chunkOrAsset;

        // if css, write to the public/assets/styles
        if (asset.fileName.endsWith('css')) {
          const css = asset.source.toString();
          const dest = join(STYLES_DIR, asset.fileName);

          // todo: are we able to unify the css pipeline while having multiple exported files?
          mkdirSync(dirname(dest), { recursive: true });
          writeFileSync(dest, css, { encoding: 'UTF-8' });

          continue;
        }

        console.warn('// TODO: asset imports: ', asset.fileName);
      }
    }

    return code.join('\n');
  }
};

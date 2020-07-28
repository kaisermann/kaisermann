/* eslint-disable global-require */
const { join } = require('path');

const rollup = require('rollup');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const svelte = require('rollup-plugin-svelte');
const preprocess = require('svelte-preprocess');
const replace = require('@rollup/plugin-replace');

const PROD = process.env.ELEVENTY_ENV === 'production';

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
    }),
    emitCss: true,
    // See note below
    css(css) {
      css.write('public/assets/styles/extra.css', false);
    },
  }),
  PROD && terser(),
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
      file: 'dist/assets/main.bundle.js',
    };

    const bundle = await rollup.rollup(inputOptions);
    const { output } = await bundle.generate(outputOptions);

    const code = [];

    for (const chunkOrAsset of output) {
      if (chunkOrAsset.type === 'chunk') {
        code.push([chunkOrAsset.code]);
      } else {
        console.warn('// TODO: asset imports');
      }
    }

    return code.join('\n');
  }
};

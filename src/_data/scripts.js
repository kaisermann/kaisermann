const path = require('path');

const glob = require('tiny-glob');
const rollup = require('rollup');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const svelte = require('rollup-plugin-svelte');
const preprocess = require('svelte-preprocess');
const replace = require('@rollup/plugin-replace');
const postcss = require('rollup-plugin-postcss');

const { getStringHash } = require('../utils/hash');

const PROD = process.env.ELEVENTY_ENV === 'production';

const plugins = [
  replace({
    preventAssignment: true,
    values: {
      'process.env.ELEVENTY_ENV': JSON.stringify(process.env.ELEVENTY_ENV),
    },
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
  postcss({ extract: true }),
  PROD && terser(),
];

async function bundleFile(input) {
  const inputOptions = {
    input,
    plugins,
  };

  const outputOptions = {
    sourcemap: false,
    format: 'es',
    name: 'main',
  };

  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);

  let content = '';
  const assets = [];

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === 'chunk') {
      content += `${chunkOrAsset.code}\n`;
      continue;
    }

    const asset = chunkOrAsset;

    // if css, write to the public/assets/styles
    // if (asset.fileName.endsWith('css')) {
    //   assets.push({
    //     content: asset.source.toString(),
    //     filename: asset.fileName,
    //   });

    //   continue;
    // }

    console.warn('// TODO: asset imports: ', asset.fileName);
  }

  return {
    content,
    basename: path.basename(input, path.extname(input)),
    filename: path.relative('src/', input),
    hash: getStringHash(content),
    assets,
  };
}

module.exports = async () => {
  const scripts = [];

  for await (const file of await glob('src/**/entry.js')) {
    const bundle = await bundleFile(file);

    scripts.push(bundle);
  }

  return scripts;
};

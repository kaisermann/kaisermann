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

const { setAssets } = require('./state');
const { getAsset } = require('./utils');

const PROD = process.env.ELEVENTY_ENV === 'production';

const getPlugins = () => [
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
  const inputDir = path.dirname(input);

  const inputOptions = {
    input,
    plugins: getPlugins(),
  };

  const outputOptions = {
    sourcemap: false,
    format: 'es',
    dir: `dist/`,
  };

  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);

  let jsContent = '';
  const assets = [];

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === 'chunk') {
      jsContent += `${chunkOrAsset.code}\n`;
      continue;
    }

    const asset = chunkOrAsset;

    if (asset.fileName.endsWith('css')) {
      assets.push(
        getAsset({
          fileName: path.join(inputDir, asset.fileName),
          content: asset.source.toString(),
        }),
      );

      continue;
    }

    console.warn('// TODO: asset imports: ', asset.fileName);
  }

  // add entry as first file
  // but ignore empty js files
  if (!jsContent.includes('export default undefined')) {
    assets.unshift(
      getAsset({
        fileName: input,
        content: jsContent,
      }),
    );
  }

  return assets;
}

exports.assetBundler = async function assetBundler() {
  const assets = [];

  for await (const file of await glob('src/**/{entry,*.entry}.{js,css}')) {
    console.log(`Found asset entry point: ${file}`);
    const bundle = await bundleFile(file);

    assets.push(bundle);
  }

  // each bundle can have multiple assets, so we need to flatten these arrays
  return setAssets(assets.flat());
};

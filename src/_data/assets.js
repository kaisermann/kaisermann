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

function getAsset({ filePath, content, root }) {
  return {
    root,
    content,
    hash: getStringHash(content),
    ext: path.extname(filePath),
    baseName: path.basename(filePath, path.extname(filePath)),
    fileName: path.join(root, path.basename(filePath)),
  };
}

async function bundleFile(input) {
  const groupPath = path.relative('src/', path.dirname(input));
  const inputOptions = {
    input,
    plugins: getPlugins(),
  };

  const outputOptions = {
    sourcemap: false,
    format: 'es',
    dir: `${groupPath}/dist`,
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

    // if css, write to the public/assets/styles
    if (asset.fileName.endsWith('css')) {
      const cssContent = asset.source.toString();

      assets.push(
        getAsset({
          root: groupPath,
          filePath: asset.fileName,
          content: cssContent,
        }),
      );

      continue;
    }

    console.warn('// TODO: asset imports: ', asset.fileName);
  }

  assets.unshift(
    getAsset({
      root: groupPath,
      filePath: input,
      content: jsContent,
    }),
  );

  return assets;
}

module.exports = async () => {
  const assets = [];

  for await (const file of await glob('src/**/entry.js')) {
    console.log(`Found asset entry point: ${file}`);
    const bundle = await bundleFile(file);

    assets.push(bundle);
  }

  // each bundle can have multiple assets, so we need to flatten these arrays
  return assets.flat();
};

const path = require('path');
const fs = require('fs');

const glob = require('tiny-glob');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');

const { getStringHash } = require('../utils/hash');

const { plugins } = postcssrc.sync();

async function processCSS(input) {
  const css = await postcss(plugins)
    .process(fs.readFileSync(input), { from: input })
    .then((result) => result.css);

  return {
    content: css,
    basename: path.basename(input, path.extname(input)),
    filename: path.relative('src/', input),
    hash: getStringHash(css),
  };
}

module.exports = async () => {
  const scripts = [];

  for await (const file of await glob('src/**/{entry.css,*.entry.css}')) {
    const bundle = await processCSS(file);

    scripts.push(bundle);
  }

  return scripts;
};

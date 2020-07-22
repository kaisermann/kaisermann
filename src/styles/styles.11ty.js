/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');

const postcss = require('postcss');
const postcssEngine = postcss([
  require('postcss-preset-env'),
  require('cssnano'),
]);

module.exports = class {
  async data() {
    const rawFilepath = path.join(__dirname, `main.css`);

    return {
      permalink: `css/styles.css`,
      rawFilepath,
      rawCss: await fs.readFileSync(rawFilepath),
    };
  }

  render({ rawCss, rawFilepath }) {
    return postcssEngine
      .process(rawCss, { from: rawFilepath })
      .then((result) => result.css);
  }
};

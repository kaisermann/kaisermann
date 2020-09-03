/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');

const postcss = require('postcss');
const postcssrc = require('postcss-load-config');

const { plugins } = postcssrc.sync();

module.exports = class {
  async data() {
    const rawFilepath = path.join(__dirname, 'styles', 'markdown.css');

    return {
      rawFilepath,
      permalink: 'assets/styles/markdown.css',
      rawCss: fs.readFileSync(rawFilepath),
    };
  }

  render({ rawCss, rawFilepath }) {
    return postcss(plugins)
      .process(rawCss, { from: rawFilepath })
      .then((result) => result.css);
  }
};

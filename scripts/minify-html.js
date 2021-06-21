#!/usr/bin/env node
const { promises: fs } = require('fs');
const path = require('path');

const htmlmin = require('html-minifier');
const glob = require('tiny-glob');

async function script() {
  await fs.mkdir('./.tmp', { recursive: true });

  for await (const file of await glob('public/**/*.html')) {
    console.log(`Minifying HTML of "${file}"`);

    const unminified = (await fs.readFile(file)).toString();
    const minified = htmlmin.minify(unminified, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    });

    await fs.writeFile(file, minified, {
      encoding: 'utf-8',
    });
  }
}

script();

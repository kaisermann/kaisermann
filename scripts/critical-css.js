#!/usr/bin/env node
const { promises: fs } = require('fs');
const path = require('path');

const critical = require('critical');
const glob = require('tiny-glob');

async function script() {
  await fs.mkdir('./.tmp', { recursive: true });

  for await (const file of await glob('public/**/*.html')) {
    console.log(`Inlining criticall CSS of "${file}"`);
    //   critical "$f" --base public/ --inline > ./.tmp/$f
    const generated = await critical.generate({
      src: file,
      base: process.cwd(),
      inline: {
        strategy: 'media',
        noscript: 'head',
      },
    });

    await fs.writeFile(file, generated.html, {
      encoding: 'utf-8',
    });
  }
}

script();

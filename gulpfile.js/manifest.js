const { readFileSync } = require('fs')
const { relative, join } = require('path')

const params = require('./params')
const browserSync = require('browser-sync')

/** Load the crius manifest */
const crius = JSON.parse(readFileSync('./crius.json', 'utf8'))

/** Default path values */
crius.config.paths = {
  ...{
    source: 'app/',
    dist: 'dist/',
    manifest: 'assets.json',
    root: process.cwd(),
  },
  ...crius.config.paths,
}
crius.config.paths.distToRoot = relative(
  join(crius.config.paths.dist, 'resource'),
  crius.config.paths.root
)

/** Project's package.json content (used for getting stylint config) */
crius.pkg = require(join(crius.config.paths.root, 'package.json'))

/** Default browserSync configuration */
if (crius.config.browserSync) {
  crius.config.browserSync = {
    ...{
      mode: 'proxy',
      index: 'index.html',
      baseDir: './',
      watchFiles: [],
      whitelist: [],
      blacklist: [],
    },
    ...crius.config.browserSync,
  }
}

/** Default values for each 'resource' entry */
for (const [resourceType, resourceInfo] of Object.entries(crius.resources)) {
  crius.resources[resourceType] = {
    ...{ directory: resourceType },
    ...resourceInfo,
  }
}

/** Create a browsersync instance if '--sync' was passed */
if (params.sync) {
  crius.browserSyncInstance = browserSync.create()
}

module.exports = crius

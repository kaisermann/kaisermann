const { readFileSync } = require('fs')
const { relative, join } = require('path')

const Flags = require('./Flags')
const browserSync = require('browser-sync')

/** Load the crius manifest */
const Manifest = JSON.parse(readFileSync('./crius.json', 'utf8'))

/** Default path values */
Manifest.paths = {
  source: 'app/',
  dist: 'dist/',
  manifest: 'assets.json',
  root: process.cwd(),
  ...Manifest.paths,
}

Manifest.paths.distToRoot = relative(
  join(Manifest.paths.dist, 'resource'),
  Manifest.paths.root
)

/** Default values for each 'resource' entry */
for (const [resourceType, resourceInfo] of Object.entries(Manifest.resources)) {
  Manifest.resources[resourceType] = {
    directory: resourceType,
    ...resourceInfo,
  }
}

/** Create a browsersync instance if '--sync' was passed */
if (Flags.sync) {
  /** Default browserSync configuration */
  Manifest.browserSync = {
    mode: 'proxy',
    index: 'index.html',
    baseDir: './',
    watchFiles: [],
    whitelist: [],
    blacklist: [],
    ...Manifest.browserSync,
  }
  Manifest.browserSyncInstance = browserSync.create()
}

module.exports = {
  getDirectoryName (resourceType) {
    return Manifest.resources[resourceType].directory
  },
  getSourceDir (resourceType, ...args) {
    return join(
      Manifest.paths.source,
      this.getDirectoryName(resourceType),
      ...args
    )
  },
  getDistDir (resourceType, ...args) {
    return join(
      Manifest.paths.dist,
      this.getDirectoryName(resourceType),
      ...args
    )
  },
  ...Manifest,
}

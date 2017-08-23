const { readFileSync } = require('fs')
const { relative, join } = require('path')
const browserSyncLib = require('browser-sync')
const deepExtend = require('deep-extend')

const params = require('./params')

// Loads the crius manifest
const crius = JSON.parse(readFileSync('./crius.json', 'utf8'))

// Default path values
crius.config.paths = deepExtend(
  {
    source: 'app/',
    dist: 'dist/',
  },
  crius.config.paths
)

// Default values for the `config` object
crius.config = deepExtend(
  {
    paths: {
      revisionManifest: 'assets.json',
      fromDistToSource: relative(
        join(crius.config.paths.dist, 'any'),
        crius.config.paths.source
      ),
    },
  },
  crius.config
)

// Default browserSync configuration
if (crius.config.browserSync) {
  crius.config.browserSync = deepExtend(
    {
      mode: 'proxy',
      index: 'index.html',
      baseDir: './',
      watchFiles: [],
      whitelist: [],
      blacklist: [],
    },
    crius.config.browserSync
  )
}

// Default values for each 'resource' entry
for (const [resourceType, resourceInfo] of Object.entries(crius.resources)) {
  crius.resources[resourceType] = deepExtend(
    { directory: resourceType },
    resourceInfo
  )
}

// Parses passed parameters
crius.params = params

// Creates a broswersync instance
if (crius.params.sync) {
  crius.browserSyncInstance = browserSyncLib.create()
}

module.exports = crius

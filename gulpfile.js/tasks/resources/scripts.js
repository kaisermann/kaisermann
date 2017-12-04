const gulp = require('gulp')
const lazypipe = require('lazypipe')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const rev = require('gulp-rev')

const crius = require('../../manifest')
const params = require('../../params')

const bundler = require('../../utils/rollup/bundler')
const writeToManifest = require('../../utils/writeToManifest')

module.exports = {
  tasks: {
    before: ['lint:scripts'],
  },
  pipelines: {
    each: asset => {
      let lazy = lazypipe()

      /** Initialize sourcemaps */
      if (params.maps) {
        lazy = lazy.pipe(sourcemaps.init)
      }

      /** Bundle the js files */
      lazy = lazy.pipe(bundler)

      /** Passthrough autoload files (Gulp 4) */
      if (asset.autoload && asset.autoload.length) {
        lazy = lazy.pipe(gulp.src, asset.autoload, { passthrough: true })
      }

      /** Concatenate all read files */
      lazy = lazy.pipe(concat, asset.outputName)

      /** Uglify if not debugging (-d) */
      if (!params.debug) {
        lazy = lazy.pipe(uglify)
      }

      /** Write the sourcemaps */
      if (params.maps) {
        lazy = lazy.pipe(sourcemaps.write, '.', {
          sourceRoot: crius.config.paths.distToRoot,
        })
      }

      /** If production, create cache-busting files */
      if (params.production) {
        lazy = lazy.pipe(rev)
      }

      return lazy
    },
    merged: writeToManifest,
  },
}

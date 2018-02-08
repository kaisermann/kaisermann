const gulp = require('gulp')
const lazypipe = require('lazypipe')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')

const Manifest = require('../Manifest')
const Flags = require('../Flags')

const bundler = require('../rollup/bundler')

module.exports = {
  tasks: {
    before: ['lint:scripts'],
  },
  pipelines: {
    each: asset => {
      let lazy = lazypipe()

      /** Initialize sourcemaps */
      if (Flags.maps) {
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
      if (!Flags.debug) {
        lazy = lazy.pipe(uglify)
      }

      /** Write the sourcemaps */
      if (Flags.maps) {
        lazy = lazy.pipe(sourcemaps.write, '.', {
          sourceRoot: Manifest.paths.distToRoot,
        })
      }

      return lazy
    },
  },
}

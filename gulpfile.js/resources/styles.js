const gulp = require('gulp')
const lazypipe = require('lazypipe')
const gulpIf = require('gulp-if')
const concat = require('gulp-concat')
const postcss = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const stylus = require('gulp-stylus')

const postCSSautoprefixer = require('autoprefixer')
const postCSSmqpacker = require('css-mqpacker')
const postCSSnano = require('cssnano')

const Manifest = require('../Manifest')
const Flags = require('../Flags')

const stylusOpts = {
  'include css': true,
  use: [require('rupture')(), require('nib')()],
  import: ['nib/lib/nib/positions', 'nib/lib/nib/size'],
  include: ['./', './node_modules/'],
}

module.exports = {
  tasks: {
    before: ['lint:styles'],
  },
  pipelines: {
    each: asset => {
      let lazy = lazypipe()

      /** Initialize sourcemaps */
      if (Flags.maps) {
        lazy = lazy.pipe(sourcemaps.init)
      }

      /** Compile .styl files */
      lazy = lazy.pipe(() => gulpIf('*.styl', stylus(stylusOpts)))

      /** Passthrough autoload files (Gulp 4) */
      if (asset.autoload && asset.autoload.length) {
        lazy = lazy.pipe(gulp.src, asset.autoload, { passthrough: true })
      }

      /** PostCSS plugins (autoprefixing, media query combine and cssNano) */
      lazy = lazy.pipe(concat, asset.outputName).pipe(postcss, [
        postCSSautoprefixer(),
        postCSSmqpacker(),
        postCSSnano({
          core: !Flags.debug,
          discardComments: !Flags.debug,
        }),
      ])

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

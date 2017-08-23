const gulp = require('gulp')
const lazypipe = require('lazypipe')
const gulpIf = require('gulp-if')
const concat = require('gulp-concat')
const postcss = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const stylus = require('gulp-stylus')
const util = require('gulp-util')

const postCSSautoprefixer = require('autoprefixer')
const postCSSmqpacker = require('css-mqpacker')
const postCSSnano = require('cssnano')

const crius = require('../manifest')

module.exports = {
  pipelines: {
    each: asset => {
      return (
        lazypipe()
          .pipe(() => gulpIf(crius.params.maps, sourcemaps.init()))
          .pipe(() =>
            gulpIf(
              '*.styl',
              stylus({
                include: ['./', './node_modules/'],
                'include css': true,
              })
            )
          )
          // Gulp 4. Appends autoload files to the main stream
          // Only if asset.autoload is defined
          .pipe(
            asset.autoload && asset.autoload.length ? gulp.src : util.noop,
            asset.autoload,
            {
              passthrough: true,
            }
          )
          .pipe(concat, asset.outputName)
          .pipe(postcss, [
            postCSSautoprefixer(),
            postCSSmqpacker(),
            postCSSnano({
              core: !crius.params.debug,
              discardComments: !crius.params.debug,
            }),
          ])
          .pipe(() =>
            gulpIf(
              crius.params.maps,
              sourcemaps.write('.', {
                sourceRoot: crius.config.paths.fromDistToSource,
              })
            )
          )
      )
    },
  },
}

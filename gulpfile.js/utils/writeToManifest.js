const gulp = require('gulp')
const lazypipe = require('lazypipe')
const rev = require('gulp-rev')
const crius = require('../manifest.js')
const { join } = require('path')

/** Writes production asset to a json manifest */
module.exports = () => {
  return lazypipe()
    .pipe(
      rev.manifest,
      join(crius.config.paths.dist, crius.config.paths.manifest),
      {
        base: crius.config.paths.dist,
        merge: true,
      }
    )
    .pipe(gulp.dest, crius.config.paths.dist)
}

const gulp = require('gulp')
const crius = require('../manifest')
const sizereport = require('gulp-sizereport')

module.exports = function (fileGlob = '') {
  const fn = function (done) {
    gulp
      .src([
        `${crius.config.paths.dist}/**/${fileGlob}`,
        `!${crius.config.paths.dist}/**/*.map`,
      ])
      .pipe(
        sizereport({
          gzip: true,
        })
      )
      .on('end', done)
      .on('error', done)
      .resume()
  }
  fn.displayName = 'sizereport'
  return fn
}

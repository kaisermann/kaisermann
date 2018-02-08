const gulp = require('gulp')
const Manifest = require('../Manifest')
const sizereport = require('gulp-sizereport')

module.exports = function (fileGlob = '') {
  const fn = function (done) {
    gulp
      .src([
        `${Manifest.paths.dist}/**/${fileGlob}`,
        `!${Manifest.paths.dist}/**/*.map`,
      ])
      .pipe(sizereport({ gzip: true }))
      .on('end', done)
      .on('error', done)
      .resume()
  }
  fn.displayName = 'sizereport'
  return fn
}

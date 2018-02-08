const rimraf = require('rimraf')
const gulp = require('gulp')
const Manifest = require('../Manifest')
const sizereport = require('../utils/sizereport')

gulp.task('clean', done => rimraf(Manifest.paths.dist, done))

gulp.task('sizereport', sizereport('*'))

gulp.task(
  'compile',
  gulp.series(gulp.parallel(Object.keys(Manifest.resources)), 'sizereport')
)

gulp.task('build', gulp.series('clean', 'compile'))

gulp.task('default', gulp.series('build'))

const { join } = require('path')
const { readFileSync } = require('fs')

const gulp = require('gulp')
const stylint = require('gulp-stylint')
const eslint = require('gulp-eslint')

const Manifest = require('../Manifest')
const Flags = require('../Flags')

const noop = require('../utils/noop')

/** Project's package.json content (used for getting stylint config) */
const stylintrc = JSON.parse(
  readFileSync(join(Manifest.paths.root, '.stylintrc'))
)

gulp.task('lint:styles', done => {
  const stylesDir = Manifest.getSourceDir('styles')
  const lintGlobs = [stylesDir].map(path => join(path, '**/*.styl'))

  return gulp
    .src(lintGlobs)
    .pipe(
      stylint({
        reporter: stylintrc.reporter,
        reporterOptions: stylintrc.reporterOptions,
        rules: stylintrc,
      })
    )
    .pipe(stylint.reporter())
    .pipe(Flags.production ? stylint.reporter('fail') : noop())
    .on('end', done)
    .on('error', done)
})

gulp.task('lint:scripts', done => {
  const scriptsDir = Manifest.getSourceDir('scripts')
  const lintGlobs = [scriptsDir, `!${join(scriptsDir, 'autoload')}`]
    .map(path => join(path, '**/*.js'))
    .concat('gulpfile.js/**/*.js')

  return gulp
    .src(lintGlobs)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(Flags.production ? eslint.failAfterError() : noop())
    .on('end', done)
    .on('error', done)
})

gulp.task('lint', gulp.parallel('lint:styles', 'lint:scripts'))

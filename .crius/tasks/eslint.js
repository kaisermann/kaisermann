const gulp = require('gulp')
const eslint = require('gulp-eslint')
const gulpIf = require('gulp-if')
const crius = require('../manifest')
const getResourceDir = require('../utils/getResourceDir')

gulp.task('eslint', done => {
  const scriptsDir = getResourceDir('source', 'scripts')
  return gulp
    .src([
      'gulpfile.*.js',
      `${scriptsDir}/**/*.js`,
      `!${scriptsDir}/autoload/*.js`,
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpIf(crius.params.production, eslint.failAfterError()))
    .on('end', done)
    .on('error', done)
})

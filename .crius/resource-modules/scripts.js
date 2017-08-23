const gulp = require('gulp')
const lazypipe = require('lazypipe')
const gulpIf = require('gulp-if')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const betterRollup = require('gulp-better-rollup')
const util = require('gulp-util')

// const rollUpBabel = require('rollup-plugin-babel')
const rollUpBuble = require('rollup-plugin-buble')
const rollUpCommonjs = require('rollup-plugin-commonjs')
const rollUpNodeResolve = require('rollup-plugin-node-resolve')
const rollUpNodebuiltins = require('rollup-plugin-node-builtins')
const rollUpSizes = require('rollup-plugin-sizes')

const crius = require('../manifest')

const rollUpPlugins = [
  // Allow to import node builtin modules such as path, url, querystring, etc
  rollUpNodebuiltins(),
  // Allow to import modules from the `node_modules`
  rollUpNodeResolve({
    module: true,
    jsnext: true,
    main: true,
    browser: true,
    extensions: ['.js'],
    preferBuiltins: true,
  }),
  // Transforms CommonJS modules into ES6 modules for RollUp
  rollUpCommonjs(),
  // Transpiles the code, ignoring coniguration from the `node_modules`
  rollUpBuble({
    transforms: {
      arrow: true,
      dangerousForOf: true,
    },
  }),
]

if (crius.params.report) {
  rollUpPlugins.push(rollUpSizes())
}

module.exports = {
  tasks: {
    before: ['eslint'],
  },
  pipelines: {
    each: asset => {
      return (
        lazypipe()
          .pipe(() => gulpIf(crius.params.maps, sourcemaps.init()))
          .pipe(betterRollup, { plugins: rollUpPlugins }, { format: 'iife' })
          // Gulp 4. Appends autoload files to the main stream
          // Only if asset.autoload is defined
          .pipe(
            asset.autoload && asset.autoload.length ? gulp.src : util.noop,
            asset.autoload,
            { passthrough: true }
          )
          .pipe(concat, asset.outputName)
          .pipe(() => gulpIf(!crius.params.debug, uglify()))
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

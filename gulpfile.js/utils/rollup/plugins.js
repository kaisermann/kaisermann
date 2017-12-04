const rollUpBuble = require('rollup-plugin-buble')
const rollUpCommonjs = require('rollup-plugin-commonjs')
const rollUpNodeResolve = require('rollup-plugin-node-resolve')
const rollUpNodebuiltins = require('rollup-plugin-node-builtins')
const rollUpSizes = require('rollup-plugin-sizes')
const rollUpSizeReporter = require('./size-reporter')

const params = require('../../params')

/** List of Rollup plugins to be used */
const plugins = [
  /** Allow to import node builtin modules such as path, url, querystring, etc */
  rollUpNodebuiltins(),
  /** Allow to import modules from the `node_modules` */
  rollUpNodeResolve({
    module: true,
    jsnext: true,
    main: true,
    browser: true,
    extensions: ['.js'],
    preferBuiltins: true,
  }),
  /** Transforms CommonJS modules into ES6 modules for RollUp */
  rollUpCommonjs(),
  /** Transpiles the code, ignoring coniguration from the `node_modules` */
  rollUpBuble({
    transforms: {
      arrow: true,
      dangerousForOf: true,
    },
  }),
]

if (params.report) {
  plugins.push(rollUpSizes({ report: rollUpSizeReporter }))
}

module.exports = plugins

const lazypipe = require('lazypipe')
const nunjucksRender = require('gulp-nunjucks-render')
const htmlmin = require('gulp-htmlmin')
const util = require('gulp-util')

const crius = require('../manifest.js')

const hyperionFilters = require('../../.hyperion/filters.js')
const hyperionMethods = require('../../.hyperion/methods.js')
const hyperionGetData = require('../../.hyperion/data.js')
const htmlminConfig = {
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: {
    compress: {
      drop_console: true,
    },
  },
  processConditionalComments: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
}

module.exports = {
  pipelines: {
    each: asset => {
      return lazypipe()
        .pipe(nunjucksRender, {
          path: crius.config.paths.source,
          manageEnv: environment => {
            Object.entries(hyperionFilters).forEach(entry =>
              environment.addFilter(...entry)
            )

            Object.entries(hyperionMethods).forEach(entry =>
              environment.addGlobal(...entry)
            )
          },
          data: hyperionGetData(),
        })
        .pipe(crius.params.production ? htmlmin : util.noop, htmlminConfig)
    },
  },
}

const lazypipe = require('lazypipe')
const nunjucksRender = require('gulp-nunjucks-render')
const htmlmin = require('gulp-htmlmin')

const crius = require('../../manifest')
const params = require('../../params')

const hyperionFilters = require('../../../.hyperion/filters')
const hyperionMethods = require('../../../.hyperion/methods')
const hyperionGetData = require('../../../.hyperion/data')
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
      let lazy = lazypipe()

      lazy = lazy.pipe(nunjucksRender, {
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

      if (params.production) {
        lazy = lazy.pipe(htmlmin, htmlminConfig)
      }

      return lazy
    },
  },
}

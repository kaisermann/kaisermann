const lazypipe = require('lazypipe')
const nunjucksRender = require('gulp-nunjucks-render')
const htmlmin = require('gulp-htmlmin')

const Manifest = require('../Manifest')
const Flags = require('../Flags')

const hyperionFilters = require('../../.hyperion/filters')
const hyperionMethods = require('../../.hyperion/methods')
const hyperionGetData = require('../../.hyperion/data')
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
        path: Manifest.paths.source,
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

      if (Flags.production) {
        lazy = lazy.pipe(htmlmin, htmlminConfig)
      }

      return lazy
    },
  },
}

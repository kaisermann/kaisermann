const lazypipe = require('lazypipe')
const flatten = require('gulp-flatten')
const newer = require('gulp-newer')
const Manifest = require('../Manifest')

module.exports = {
  pipelines: {
    each: asset => {
      let lazy = lazypipe()

      lazy = lazy.pipe(newer, Manifest.getDistDir('fonts'))

      lazy = lazy.pipe(flatten)

      return lazy
    },
  },
}

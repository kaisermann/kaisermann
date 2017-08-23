const lazypipe = require('lazypipe')
const flatten = require('gulp-flatten')

module.exports = {
  pipelines: {
    each: asset => {
      return lazypipe().pipe(flatten)
    },
  },
}

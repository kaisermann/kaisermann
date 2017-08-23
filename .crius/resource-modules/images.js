const lazypipe = require('lazypipe')
const imagemin = require('gulp-imagemin')

module.exports = {
  pipelines: {
    each: asset => {
      return lazypipe()
        .pipe(imagemin, [
          imagemin.jpegtran({ progressive: true }),
          imagemin.gifsicle({ interlaced: true }),
          imagemin.svgo({
            plugins: [{
              removeUnknownsAndDefaults: false,
            }, {
              cleanupIDs: false,
            }],
          }),
        ])
    },
  },
}

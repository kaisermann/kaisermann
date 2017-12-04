const lazypipe = require('lazypipe')
const imagemin = require('gulp-imagemin')

module.exports = {
  pipelines: {
    each: asset => {
      return lazypipe().pipe(imagemin, [
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            { removeUnknownsAndDefaults: false },
            { cleanupIDs: false },
          ],
        }),
      ])
    },
  },
}

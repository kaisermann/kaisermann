const lazypipe = require('lazypipe')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const Manifest = require('../Manifest')

module.exports = {
  pipelines: {
    each: asset => {
      let lazy = lazypipe()

      lazy = lazy.pipe(newer, Manifest.getDistDir('images'))

      lazy = lazy.pipe(imagemin, [
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

      return lazy
    },
  },
}

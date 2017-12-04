const util = require('gulp-util')

/** Simple main error handler */
module.exports = function (err) {
  util.beep()
  util.log(util.colors.red('Error message: ' + err.message))
  util.log(`Stack:\n ${err.stack}`)
  this.emit('end')
}

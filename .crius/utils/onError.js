const util = require('gulp-util')

// Simple main error handler
module.exports = function (err) {
  util.beep()
  util.log(err.message)
  this.emit('end')
}

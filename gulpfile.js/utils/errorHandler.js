const colors = require('ansi-colors')
const beeper = require('beeper')

/** Simple main error handler */
module.exports = function (err) {
  beeper()
  console.error(colors.red(`Error message: ${err.message}`))
  console.error(`Stack:\n ${err.stack}`)
  this.emit('end')
}

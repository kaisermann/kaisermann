const { accessSync } = require('fs')

/** Detects if a certain file/directory exists */
module.exports = function (path) {
  try {
    accessSync(path)
    return true
  } catch (e) {
    return false
  }
}

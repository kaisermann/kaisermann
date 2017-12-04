/**
 * Detects if a certain string represents a file or a directory
 * Is a directory if the string ends with '/' or does not contain a '.' as the first character
 * Is a file if it's not a directory
 */

module.exports = str =>
  str.slice(-1) === '/' || (str.indexOf('.') < 0 || str[0] === '.')

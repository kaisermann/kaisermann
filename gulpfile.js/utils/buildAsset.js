/** Returns a asset object */
const { join } = require('path')
const crius = require('../manifest')

const nodeModulesRegEx = /^(\.|\.\/)?(~|node_modules)/

module.exports = (outputName, baseObj, directory) => {
  let assetObj

  if (baseObj.constructor !== Object) {
    assetObj = {
      files: Array.isArray(baseObj) ? baseObj : [baseObj],
    }
  } else {
    assetObj = baseObj
    if (!assetObj.files) assetObj.files = []
    else if (!Array.isArray(assetObj.files)) {
      assetObj.files = [assetObj.files]
    }
  }
  assetObj.autoload = baseObj.autoload || []
  assetObj.outputName = outputName
  assetObj.globs = assetObj.files.map(
    path =>
      nodeModulesRegEx.test(path)
        ? path.replace(nodeModulesRegEx, './node_modules')
        : join(crius.config.paths.source, directory, path)
  )
  return assetObj
}

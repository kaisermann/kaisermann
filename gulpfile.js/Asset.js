/** Returns a asset object */
const Manifest = require('./Manifest')

const nodeModulesRegEx = /^(\.|\.\/)?(~|node_modules)/

module.exports = {
  buildObj (outputName, baseObj, resourceType) {
    let assetObj =
      baseObj.constructor === Object
        ? { ...baseObj, files: [].concat(baseObj.files || []) }
        : { files: [].concat(baseObj) }

    return {
      ...assetObj,
      outputName,
      autoload: [].concat(baseObj.autoload || []),
      globs: assetObj.files.map(
        path =>
          nodeModulesRegEx.test(path)
            ? path.replace(nodeModulesRegEx, './node_modules')
            : Manifest.getSourceDir(resourceType, path)
      ),
    }
  },
}

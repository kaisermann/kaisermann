const { join } = require('path')

const crius = require('../manifest')

// Gets the path relative to a resource folder (source or dist)
module.exports = function getResourceDir (folder, type, ...appendix) {
  return join(
    crius.config.paths[folder],
    crius.resources[type] ? crius.resources[type].directory : type,
    ...appendix
  )
}

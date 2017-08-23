const { basename, extname } = require('path')
const requireDir = require('require-directory')

// Defaults NODE_ENV to 'dev' if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'dev'
}

// Array of file names (without extension) inside `.crius/tasks`
// that should be loaded after all others tasks
const loadLater = ['default', 'uncss']

// Loads generic gulp tasks, except ones listed on `loadLater`
requireDir(module, './.crius/tasks', {
  exclude: fileName => {
    return loadLater.some(
      modName => modName === basename(fileName, extname(fileName))
    )
  },
})

// Creates the resources tasks
require('./.crius/resourcesTasksLoader')

// Load task files defined on `loadLater`
loadLater.forEach(fileName => require(`./.crius/tasks/${fileName}`))

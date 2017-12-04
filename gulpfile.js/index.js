const requireDir = require('require-directory')

/** Defaults NODE_ENV to 'dev' if not set */
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

/** Load tasks before resource-tasks */
requireDir(module, './tasks/before-resources')

/** Load resource tasks */
require('./resourcesTasksLoader')

/** Load the rest of gulp tasks */
requireDir(module, './tasks', { recurse: false })

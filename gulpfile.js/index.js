const { join } = require('path')
const { readdirSync } = require('fs')
const gulp = require('gulp')

const Resource = require('./Resource')
const Manifest = require('./Manifest')

/** Default NODE_ENV to 'dev' if not set */
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

/** Load all but the 'main' gulp tasks */
const tasksPath = join(Manifest.paths.root, 'gulpfile.js', 'tasks')
readdirSync(tasksPath).forEach(fileName => {
  if (fileName !== 'main.js') {
    require(join(tasksPath, fileName))
  }
})

/** Load resources modules */
Resource.loadModules()

/** Automatically create the resources tasks */
for (const [resourceType, resourceInfo] of Object.entries(Manifest.resources)) {
  /** Pushes the resource task and its dependencies  */
  const taskQueue = Resource.getTasks(resourceType, resourceInfo)
  gulp.task(resourceType, gulp.series(taskQueue))
}

/** Finally, load the main default tasks */
require('./tasks/main.js')

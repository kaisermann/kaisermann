const { join } = require('path')
const requireDir = require('require-directory')
const merge = require('merge-stream')

const gulp = require('gulp')
const { noop } = require('gulp-util')
const plumber = require('gulp-plumber')

const errorHandler = require('./utils/errorHandler')
const isDir = require('./utils/isDir')
const sizereport = require('./utils/sizereport')
const buildAsset = require('./utils/buildAsset')

const crius = require('./manifest')
const params = require('./params')

/** Load resource sub-task modules */
const resMods = requireDir(module, './tasks/resources')
for (const resourceType of Object.keys(crius.resources)) {
  /** Default resource module properties */
  resMods[resourceType] = {
    tasks: {},
    pipelines: {},
    ...resMods[resourceType],
  }
}

/** Get a valide resource pipeline or a noop */
const getResourcePipeline = (pipeline, resourceType, ...args) =>
  typeof resMods[resourceType].pipelines[pipeline] === 'function'
    ? resMods[resourceType].pipelines[pipeline](...args)()
    : noop()

/** Resource sub-task creator */
const getResourceSubtask = (resourceType, resourceInfo) => {
  const innerTaskFn = done => {
    /** Merged object to use on resourceModule.pipelines.merged */
    const merged = merge()
    const assets = crius.resources[resourceType].assets

    /** For each asset on the current resource */
    for (const [outputName, assetObj] of Object.entries(assets)) {
      /** Reads each resource asset and parses its 'files' property */
      const asset = buildAsset(outputName, assetObj, resourceInfo.directory)
      const output = join(
        crius.config.paths.dist,
        resourceInfo.directory,
        isDir(outputName) ? outputName : ''
      )

      merged.add(
        gulp
          .src(asset.globs)
          .pipe(plumber({ errorHandler }))
          .pipe(getResourcePipeline('each', resourceType, asset))
          .pipe(gulp.dest(output))
          .pipe(
            crius.browserSyncInstance
              ? crius.browserSyncInstance.stream({
                match: `**/${resourceInfo.pattern}`,
              })
              : noop()
          )
      )
    }

    merged
      .pipe(getResourcePipeline('merged', resourceType, resourceInfo))
      .on('end', done)
      .on('error', done)
      .resume()
  }

  /** Sets inner task name for display purposes */
  innerTaskFn.displayName = `${resourceType} > sub-task`
  return innerTaskFn
}

/** Automatically create the resources tasks */
const shouldReportSizes = params.report && process.argv.includes('watch')
for (const [resourceType, resourceInfo] of Object.entries(crius.resources)) {
  /** Pushes the resource task and its dependencies  */
  const resourceTasks = resMods[resourceType].tasks
  const taskQueue = []
    .concat(resourceTasks.before || [])
    .concat(getResourceSubtask(resourceType, resourceInfo))
    .concat(resourceTasks.after || [])
    .concat(
      shouldReportSizes || process.argv.includes(resourceType)
        ? sizereport(resourceInfo.pattern)
        : []
    )

  /** If we have no dependency tasks, pass only the resource task and not a task series */
  gulp.task(
    resourceType,
    taskQueue.length === 1 ? taskQueue[0] : gulp.series(taskQueue)
  )
}

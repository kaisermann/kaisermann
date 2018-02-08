const gulp = require('gulp')
const merge = require('merge-stream')
const plumber = require('gulp-plumber')

const Manifest = require('./Manifest')
const Asset = require('./Asset')
const Flags = require('./Flags')

const sizereport = require('./utils/sizereport')
const errorHandler = require('./utils/errorHandler')
const isDir = require('./utils/isDir')
const noop = require('./utils/noop')

const resourcesModules = {}

/** Get a valide resource pipeline or a noop */
const getResourcePipeline = pipeline => (resourceType, ...args) =>
  typeof resourcesModules[resourceType].pipelines[pipeline] === 'function'
    ? resourcesModules[resourceType].pipelines[pipeline](...args)()
    : noop()

const getEachPipeline = getResourcePipeline('each')
const getMergedPipeline = getResourcePipeline('merged')

/** Resource task generator */
const Resource = {
  loadModules () {
    /** Default resource module properties */
    Object.entries(Manifest.resources).forEach(
      ([resourceType, resourceInfo]) => {
        let resourceModule

        /** Try to load the resource module */
        try {
          resourceModule = require(`./resources/${resourceType}.js`)
        } catch (e) {
          resourceModule = {}
        }

        resourceModule = {
          tasks: {},
          pipelines: {},
          ...resourceModule,
        }

        /** If task was called by the CLI and -r or --report is true, report sizes. */
        if (
          Flags.report &&
          (process.argv.includes(resourceType) ||
            process.argv.includes('watch'))
        ) {
          resourceModule.tasks.after = []
            .concat(resourceModule.tasks.after || [])
            .concat(sizereport(resourceInfo.pattern))
        }

        resourcesModules[resourceType] = resourceModule
      }
    )
  },
  getTasks (resourceType, resourceInfo) {
    return []
      .concat(resourcesModules[resourceType].tasks.before || [])
      .concat(Resource.createTask(resourceType, resourceInfo))
      .concat(resourcesModules[resourceType].tasks.after || [])
  },
  createTask (resourceType, resourceInfo) {
    const innerTaskFn = done => {
      /** Merged object to use on resourceModule.pipelines.merged */
      const merged = merge()

      /** For each asset on the current resource */
      for (const [outputName, assetObj] of Object.entries(
        resourceInfo.assets
      )) {
        /** Reads each resource asset and parses its 'files' property */
        const asset = Asset.buildObj(outputName, assetObj, resourceType)

        const output = Manifest.getDistDir(
          resourceType,
          isDir(outputName) ? outputName : ''
        )

        merged.add(
          gulp
            .src(asset.globs)
            .pipe(plumber({ errorHandler }))
            .pipe(getEachPipeline(resourceType, asset))
            .pipe(gulp.dest(output))
            .pipe(
              Manifest.browserSyncInstance
                ? Manifest.browserSyncInstance.stream({
                  match: `**/${resourceInfo.pattern}`,
                })
                : noop()
            )
        )
      }

      merged
        .pipe(getMergedPipeline(resourceType, resourceInfo))
        .on('end', done)
        .on('error', done)
        .resume()
    }

    /** Sets inner task name for display purposes */
    innerTaskFn.displayName = `${resourceType} > sub-task`
    return innerTaskFn
  },
}

module.exports = Resource

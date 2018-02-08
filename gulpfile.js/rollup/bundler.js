const { relative, basename } = require('path')
const through2 = require('through2')
const rollup = require('rollup')

const PluginError = require('plugin-error')

const Flags = require('../Flags')
const Manifest = require('../Manifest')

const plugins = require('./plugins')

const rollupCache = new Map()
/**
 * Return a pipeable method that uses the current
 * gulp stream of files as the input for Rollup
 */
module.exports = () =>
  through2.obj(async (file, enc, next) => {
    const opts = {
      plugins,
      cache: rollupCache.get(file.path),
      input: file.path,
      output: {
        sourcemap: Flags.maps,
        format: 'iife',
      },
    }

    try {
      const bundle = await rollup.rollup(opts)
      const { code, map } = await bundle.generate(opts)
      rollupCache.set(file.path, bundle)

      if (map) {
        map.file = relative(Manifest.paths.root, file.path)
        map.sources = map.sources.map(
          source =>
            source === file.path
              ? basename(file.path)
              : relative(file.path, source)
        )
        file.sourceMap = map
      }

      file.contents = Buffer.from(code)
    } catch (err) {
      /** Invalidate the cache in case of error */
      rollupCache.delete(file.path)
      console.log(new PluginError('rollup', err.stack))
    } finally {
      next(null, file)
    }
  })

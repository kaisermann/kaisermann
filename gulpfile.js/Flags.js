const minimist = require('minimist')
const args = minimist(process.argv.slice(2))

const debug = args.d || args.debug
const production = !debug && (args.p || args.production)

module.exports = {
  /** Do not minify assets when '-d' */
  debug,
  /** Production mode, appends hash of file's content to its name */
  production,
  /** Create sourcemaps when not in production mode */
  maps: args.maps,
  /** Start BroswerSync when '--sync' */
  sync: args.sync,
  /** Report flag */
  report: args.report || args.r,
}

const minimist = require('minimist')
const args = minimist(process.argv.slice(2))

const isDebugging = args.d || args.debug
const isProduction = !isDebugging && (args.p || args.production)

module.exports = {
  // Do not minify assets when '-d'
  debug: isDebugging,
  // Create sourcemaps when not in production mode
  maps: args.maps,
  // Production mode, appends hash of file's content to its name
  production: isProduction,
  // Start BroswerSync when '--sync'
  sync: args.sync,
  // Report flag
  report: args.report || args.r,
}

const { relative } = require('path')
const colors = require('ansi-colors')
const filesize = require('filesize')

const Manifest = require('../Manifest')

/** Custom reporter for rollup-plugin-sizes */
const divisor = '---------------------------------------'
module.exports = details => {
  const args = { ...details }

  // Sort
  args.totals.sort((a, b) => b.size - a.size)
  console.log('\n' + divisor)
  console.log(
    colors.bold(colors.blue('  Module "%s":')),
    relative(Manifest.paths.root, args.input)
  )
  console.log(divisor)

  args.totals.forEach(item => {
    const sizePercentage = (item.size / args.total * 100).toFixed(2)
    const sizeColor =
      sizePercentage > 50 ? 'red' : sizePercentage > 35 ? 'yellow' : 'green'

    console.log(
      '  %s - %s (%s)',
      colors.bold(item.name),
      colors.yellow(filesize(item.size)),
      colors[sizeColor](sizePercentage) + '%'
    )
  })

  console.log(divisor + '\n')
}

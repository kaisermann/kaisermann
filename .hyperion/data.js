const { readFileSync } = require('fs')
const deepExtend = require('deep-extend')

const parseAppData = () => {
  /*
   * Reads a string like "{{prop1.prop2.prop3...}}" and returns the actual
   * value of 'object['prop1']['prop2']['prop3']...'
   */
  const parsePropStr = str => {
    let matched

    if (typeof str === 'string' && (matched = /{{\s?(\S*)\s?}}/g.exec(str))) {
      return str.replace(
        matched[0],
        matched[1].split('.').reduce((o, i) => o[i], appData)
      )
    }
    return str
  }

  /*
   * Iterate through the object and transform all
   * {{property.etc.etc2.etc3...}} into actual properties
   */
  const parseStringReferences = obj =>
    Object.entries(obj).reduce((acc, [key, val]) => {
      acc[key] =
        val.constructor === Object
          ? parseStringReferences(val)
          : parsePropStr(val)
      return acc
    }, {})

  // Reads the 'app.json' file
  let appData = JSON.parse(readFileSync('app.json', 'utf8'))

  /*
   * If NODE_ENV is set and inside the 'app.json[environments]',
   * append its variables to the 'app' object.
   */
  appData = deepExtend(
    appData,
    appData.environments
      ? appData.environments[process.env.NODE_ENV]
        ? appData.environments[process.env.NODE_ENV]
        : {}
      : {}
  )
  delete appData.environments

  appData = parseStringReferences(appData)
  return appData
}

/* This modules exports a function and not an object.
 * This way we can read more than once the 'app.json' file
 * and see live changes when its content is edited.
*/
module.exports = () => {
  return {
    // Default 'app' object
    app: parseAppData(),
  }
}

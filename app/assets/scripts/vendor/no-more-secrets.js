const nms = (() => {
  const curry = (f, ...args) =>
    args.length >= f.length
      ? f(...args)
      : (...next) => curry(f.bind(f, ...args), ...next)

  const pipe = (...fns) => start => fns.reduce((state, fn) => fn(state), start)

  const prop = curry((key, obj) => obj[key])

  const map = curry((cb, list) => Array.prototype.map.call(list, cb))
  const filter = curry((cb, list) => Array.prototype.filter.call(list, cb))
  const split = curry((target, str) => String.prototype.split.call(str, target))

  const defaultConfig = {
    maxUpdateInterval: 100,
    minUpdateInterval: 25,
    maxUpdates: 50,
    extraDelay: 50,
    initialDelay: 1000,
  }

  const page437Characters = [
    '☺\uFE0E',
    '☻\uFE0E',
    '♥\uFE0E',
    '♦\uFE0E',
    '♣\uFE0E',
    '♠\uFE0E',
    '•',
    '◘',
    '○',
    '◙',
    '♂\uFE0E',
    '♀\uFE0E',
    '♪\uFE0E',
    '♫\uFE0E',
    '☼\uFE0E',
    '►',
    '◄',
    '↕',
    '‼',
    '¶',
    '§',
    '▬',
    '↨',
    '↑',
    '↓',
    '→',
    '←',
    '∟',
    '↔',
    '▲',
    '▼',
    '!',
    '"',
    '#',
    '$',
    '%',
    '&',
    "'",
    '(',
    ')',
    '*',
    '+',
    ', ',
    '-',
    '.',
    '/',
    ':',
    ';',
    '<',
    '=',
    '>',
    '?',
    '@',
    ']',
    '^',
    '`',
    '{',
    '|',
    '}',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '~',
    '⌂',
    'Ç',
    'ü',
    'é',
    'â',
    'ä',
    'à',
    'å',
    'ç',
    'ê',
    'ë',
    'è',
    'ï',
    'î',
    'ì',
    'Ä',
    'Å',
    'É',
    'æ',
    'Æ',
    'ô',
    'ö',
    'ò',
    'û',
    'ù',
    'ÿ',
    'Ö',
    'Ü',
    '¢',
    '£',
    '¥',
    '₧',
    'ƒ',
    'á',
    'í',
    'ó',
    'ú',
    'ñ',
    'Ñ',
    'ª',
    'º',
    '¿',
    '⌐',
    '¬',
    '½',
    '¼',
    '¡',
    '«',
    '»',
    '░',
    '▒',
    '▓',
    '│',
    '┤',
    '╡',
    '╢',
    '╖',
    '╕',
    '╣',
    '║',
    '╗',
    '╝',
    '╜',
    '╛',
    '┐',
    '└',
    '┴',
    '┬',
    '├',
    '─',
    '┼',
    '╞',
    '╟',
    '╚',
    '╔',
    '╩',
    '╦',
    '╠',
    '═',
    '╬',
    '╧',
    '╨',
    '╤',
    '╥',
    '╙',
    '╘',
    '╒',
    '╓',
    '╫',
    '╪',
    '┘',
    '┌',
    '█',
    '▄',
    '▌',
    '▐',
    '▀',
    'α',
    'ß',
    'Γ',
    'π',
    'Σ',
    'σ',
    'µ',
    'τ',
    'Φ',
    'Θ',
    'Ω',
    'δ',
    '∞',
    'φ',
    'ε',
    '∩',
    '≡',
    '±',
    '≥',
    '≤',
    '⌠',
    '⌡',
    '÷',
    '≈',
    '°',
    '∙',
    '·',
    '√',
    'ⁿ',
    '²',
    '■',
    ']',
  ]

  // find fast and pure alternative
  const getPage437Character = () =>
    page437Characters[(Math.random() * 251) >> 0]

  const doWithChance = (onSuccess, onFailure, chance = 1) => {
    const success = Math.abs(Math.random() - 1) <= chance
    return success ? onSuccess() : onFailure()
  }

  const createTextNode = text => document.createTextNode(text)
  const createElement = name => document.createElement(name)
  const replaceNode = curry((oldNode, newNode) => {
    oldNode.parentElement.replaceChild(newNode, oldNode)

    return newNode
  })
  const append = curry((parent, node) => parent.appendChild(node))
  const appendMany = curry((nodes, parent) => {
    nodes.forEach(append(parent))
    return nodes
  })

  const filterNodes = curry((ignore, filter, container) => {
    let currentNode
    const nodes = []
    const walker = document.createTreeWalker(container, filter)

    while ((currentNode = walker.nextNode())) {
      if (!ignore.includes(currentNode.parentElement.tagName)) {
        nodes.push(currentNode)
      }
    }

    return nodes
  })

  const filterTextNodes = filterNodes(['STYLE'], NodeFilter.SHOW_TEXT)

  const isNewLine = text => text.replace(/ /g, '') === '\n'
  const notBlankNode = pipe(prop('nodeValue'), text => !isNewLine(text))

  const splitTextNode = pipe(prop('nodeValue'), split(''), map(createTextNode))

  const splitAndReplaceNode = node =>
    pipe(
      () => createElement('span'),
      replaceNode(node),
      appendMany(splitTextNode(node))
    )(node)

  const encrypt = node => {
    // replacing whole node was too slow
    node.nodeValue = getPage437Character()
    return node
  }

  const decrypt = curry((config, { orginialValue, encrypted }) => {
    let interval
    let updates = 0
    let currentNode = encrypted

    const intervalTime =
      Math.random() * config.maxUpdateInterval + config.minUpdateInterval

    const update = () => {
      currentNode.nodeValue = getPage437Character() // duplicating to avoid function call
      ++updates

      if (updates > config.maxUpdates) {
        currentNode.nodeValue = orginialValue
        clearInterval(interval)
      }
    }

    interval = setInterval(
      update,
      intervalTime + doWithChance(() => config.extraDelay, () => 0, 0.1)
    )

    return interval
  })

  const encryptNode = pipe(
    splitAndReplaceNode,
    filter(node => node.nodeValue !== ' ' && !isNewLine(node.nodeValue)),
    map(node => ({ orginialValue: node.nodeValue, encrypted: encrypt(node) }))
  )

  const encryptAll = pipe(
    filterTextNodes,
    filter(notBlankNode),
    map(encryptNode)
  )

  return (element = document.body, customConfig = {}) => {
    const encryptedNodes = encryptAll(element)
    const config = Object.assign(defaultConfig, customConfig)

    setTimeout(
      () => encryptedNodes.map(map(decrypt(config))),
      config.initialDelay
    )

    return encryptedNodes
  }
})()

export default nms

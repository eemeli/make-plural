import Parser from './parser'
import Tests from './tests'

function toString(fn, name) {
  const str = Function.prototype.toString.call(fn)
  const func = name ? `function ${name}` : 'function'
  return str.replace(/^function(?: \w+)\(([^)]+)\)/, (_, args) => {
    const a = args
      .replace(/\n\/\*(``)?\*\//, '') // https://bugs.chromium.org/p/v8/issues/detail?id=2470
      .split(',')
      .map(arg => arg.trim())
    return `${func}(${a.join(', ')})`
  })
}

export default class Compiler {
  static cardinals = true
  static ordinals = false
  static rules = { cardinal: {}, ordinal: {} }
  static foldWidth = 78

  static load(...args) {
    args.forEach(cldr => {
      const data = (cldr && cldr.supplemental) || null
      if (!data) throw new Error('Data does not appear to be CLDR data')
      Compiler.rules = {
        cardinal: data['plurals-type-cardinal'] || Compiler.rules.cardinal,
        ordinal: data['plurals-type-ordinal'] || Compiler.rules.ordinal
      }
    })
    return Compiler
  }

  static getRules(type, locale) {
    if (locale.length) {
      const cat = Compiler.rules[type]
      if (locale in cat) return cat[locale]
      const lc0 = locale.toLowerCase()
      for (let lc in cat) if (lc.toLowerCase() === lc0) return cat[lc]
    }
    return null
  }

  constructor(lc, { cardinals, ordinals } = Compiler) {
    if (!lc) throw new Error('A locale is required')
    if (!cardinals && !ordinals)
      throw new Error('At least one type of plural is required')
    this.lc = lc
    this.categories = { cardinal: [], ordinal: [] }
    this.parser = new Parser()
    this.tests = new Tests(this)
    this.types = { cardinals, ordinals }
  }

  compile() {
    if (!this.fn) {
      this.fn = this.buildFunction()
      this.fn.toString = toString.bind(null, this.fn)
      this.test = () => this.tests.testAll(this.fn)
    }
    return this.fn
  }

  buildBody(type, req) {
    let cases = []
    const rules = Compiler.getRules(type, this.lc)
    if (!rules) {
      if (req) throw new Error(`Locale "${this.lc}" ${type} rules not found`)
      this.categories[type] = ['other']
      return "'other'"
    }
    for (let r in rules) {
      const [cond, ...examples] = rules[r].trim().split(/\s*@\w*/)
      const cat = r.replace('pluralRule-count-', '')
      if (cond) cases.push([this.parser.parse(cond), cat])
      this.tests.add(type, cat, examples)
    }
    this.categories[type] = cases.map(c => c[1]).concat('other')
    if (cases.length === 1) {
      return `(${cases[0][0]}) ? '${cases[0][1]}' : 'other'`
    } else {
      return [...cases.map(c => `(${c[0]}) ? '${c[1]}'`), "'other'"].join(
        '\n      : '
      )
    }
  }

  buildFunction() {
    const { cardinals, ordinals } = this.types
    const compile = c =>
      c ? (c[1] ? 'return ' : 'if (ord) return ') + this.buildBody(...c) : ''
    const fold = {
      vars(str) {
        var re = new RegExp(`(.{1,${Compiler.foldWidth}})(,|$) ?`, 'g')
        return `  ${str};`.replace(re, '$1$2\n      ')
      },
      cond(str) {
        var re = new RegExp(`(.{1,${Compiler.foldWidth}}) (\\|\\| |$) ?`, 'gm')
        return `  ${str};`.replace(re, '$1\n          $2')
      }
    }
    const cond = [
      ordinals && ['ordinal', !cardinals],
      cardinals && ['cardinal', true]
    ]
      .map(compile)
      .map(fold.cond)
    const body = [fold.vars(this.parser.vars()), ...cond]
      .filter(line => !/^[\s;]*$/.test(line))
      .map(line => line.replace(/\s+$/gm, ''))
      .join('\n')
    const args = ordinals && cardinals ? 'n, ord' : 'n'
    return new Function(args, body) // eslint-disable-line no-new-func
  }
}

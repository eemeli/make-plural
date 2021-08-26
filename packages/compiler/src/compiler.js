import { Parser } from './parser.js'
import { Tests } from './tests.js'

export class Compiler {
  static cardinals = true
  static ordinals = false
  static rules = { cardinal: {}, ordinal: {} }

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
      this.fn.toString = () =>
        // The /*``*/ is present in Node 8 output, due to
        // https://bugs.chromium.org/p/v8/issues/detail?id=2470
        Function.prototype.toString
          .call(this.fn)
          .replace(
            /^function(?: \w+)\(([^)]+)\)/,
            (_, args) => `(${args.replace('/*``*/', '').trim()}) =>`
          )
          .replace(/{\s*return\s+([^{}]*);\s*}$/, '$1')
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
      return `${cases[0][0]} ? '${cases[0][1]}' : 'other'`
    } else {
      return [...cases.map(c => `${c[0]} ? '${c[1]}'`), "'other'"].join(
        '\n    : '
      )
    }
  }

  buildFunction() {
    const { cardinals, ordinals } = this.types
    let body = ''
    if (ordinals && cardinals) {
      const ordBody = this.buildBody('ordinal', false)
      const cardBody = this.buildBody('cardinal', true)
      if (ordBody === cardBody) body = `  return ${cardBody};`
      else body = `  if (ord) return ${ordBody};\n  return ${cardBody};`
    } else {
      const pt = cardinals ? 'cardinal' : 'ordinal'
      body = `  return ${this.buildBody(pt, true)};`
    }

    const vars = this.parser.vars()
    if (vars) body = `  ${vars};\n${body}`

    const args = ordinals && cardinals ? 'n, ord' : 'n'
    return new Function(args, body) // eslint-disable-line no-new-func
  }
}

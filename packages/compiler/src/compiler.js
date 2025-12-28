import { Parser } from './parser.js'
import { testCat } from './tests.js'

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

  /**
   * @param {string} src
   * @returns {string[]}
   */
  static parseExamples(src) {
    return src
      .join(' ')
      .replace(/^[ ,]+|[ ,…]+$/g, '')
      .replace(/(0\.[0-9])~(1\.[1-9])/g, '$1 1.0 $2')
      .split(/[ ,~…]+/)
  }

  constructor(lc, { cardinals, ordinals } = Compiler) {
    if (!lc) throw new Error('A locale is required')
    if (!cardinals && !ordinals)
      throw new Error('At least one type of plural is required')
    this.lc = lc
    this.categories = { cardinal: [], ordinal: [] }
    this.examples = { cardinal: {}, ordinal: {} }
    this.parser = new Parser()
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
      this.test = () => {
        const { cardinals, ordinals } = this.types
        const ordArg = Boolean(ordinals && cardinals)
        for (const type of ['cardinal', 'ordinal'])
          for (const [cat, values] of Object.entries(this.examples[type]))
            testCat(this.lc, this.fn, ordArg, type, cat, values)
      }
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
      this.examples[type][cat] = Compiler.parseExamples(examples)
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

    const args = this.parser.args(ordinals && cardinals)
    const vars = this.parser.vars()
    if (vars) body = `  ${vars};\n${body}`

    return new Function(args, body) // eslint-disable-line no-new-func
  }
}

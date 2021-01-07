export class Tests {
  constructor(obj) {
    this.lc = obj.lc
    this.ordinal = {}
    this.cardinal = {}
  }

  add(type, cat, src) {
    this[type][cat] = { src, values: null }
  }

  error(n, type, msg, fn) {
    const lc = JSON.stringify(this.lc)
    const val = JSON.stringify(n)
    return new Error(
      `Locale ${lc} ${type} rule self-test failed for ${val} (${msg}). Function:
${fn}`
    )
  }

  testCond(n, type, expResult, fn) {
    try {
      var r = fn(n, type === 'ordinal')
    } catch (error) {
      /* istanbul ignore next: should not happen unless CLDR data is broken */
      throw this.error(n, type, error, fn.toString())
    }
    if (r !== expResult) {
      const res = JSON.stringify(r)
      const exp = JSON.stringify(expResult)
      throw this.error(n, type, `was ${res}, expected ${exp}`, fn.toString())
    }
    return true
  }

  testCat(type, cat, fn) {
    const data = this[type][cat]
    if (!data.values) {
      data.values = data.src
        .join(' ')
        .replace(/^[ ,]+|[ ,…]+$/g, '')
        .replace(/(0\.[0-9])~(1\.[1-9])/g, '$1 1.0 $2')
        .split(/[ ,~…]+/)
    }
    data.values.forEach(n => {
      this.testCond(n, type, cat, fn)
      if (!/\.0+$/.test(n)) this.testCond(n, type, cat, fn)
    })
    return true
  }

  testAll(fn) {
    for (let cat in this.cardinal) this.testCat('cardinal', cat, fn)
    for (let cat in this.ordinal) this.testCat('ordinal', cat, fn)
    return true
  }
}

export default class Tests {
  constructor(obj) {
    this.obj = obj
    this.ordinal = {}
    this.cardinal = {}
  }

  add(type, cat, src) {
    this[type][cat] = { src, values: null }
  }

  testCond(n, type, expResult, fn) {
    try {
      var r = (fn || this.obj.fn)(n, type === 'ordinal')
    } catch (e) {
      r = e.toString()
    }
    if (r !== expResult) {
      throw new Error(
        'Locale ' +
          JSON.stringify(this.obj.lc) +
          type +
          ' rule self-test failed for v = ' +
          JSON.stringify(n) +
          ' (was ' +
          JSON.stringify(r) +
          ', expected ' +
          JSON.stringify(expResult) +
          ')'
      )
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
      if (!/\.0+$/.test(n)) this.testCond(Number(n), type, cat, fn)
    })
    return true
  }

  testAll() {
    for (let cat in this.cardinal) this.testCat('cardinal', cat)
    for (let cat in this.ordinal) this.testCat('ordinal', cat)
    return true
  }
}

function errorMsg(lc, n, type, msg) {
  const val = JSON.stringify(n)
  return `Locale ${lc} ${type} rule self-test failed for ${val} (${msg})`
}

function testCond(lc, n, type, expResult, fn) {
  try {
    var r = fn(n, type === 'ordinal')
  } catch (error) {
    /* istanbul ignore next: should not happen unless CLDR data is broken */
    throw new Error(errorMsg(lc, n, type, error))
  }
  if (r !== expResult) {
    const res = JSON.stringify(r)
    const exp = JSON.stringify(expResult)
    throw new Error(errorMsg(lc, n, type, `was ${res}, expected ${exp}`))
  }
}

export function testCat(lc, type, cat, values, fn) {
  for (const n of values) {
    testCond(lc, n, type, cat, fn)
    if (!/\.0+$/.test(n)) testCond(lc, Number(n), type, cat, fn)
  }
}

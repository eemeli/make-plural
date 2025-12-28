const errorMsg = (lc, n, type, fn, args, msg) => `\
Locale ${lc} ${type} rule self-test failed for ${typeof n} ${n} (${msg})
Function: ${fn.toString()}
Arguments: ${JSON.stringify(args)}`

function testCond(lc, fn, ordArg, n, type, expResult) {
  const compact = typeof n === 'string' && n.match(/(.*)c(\d+)$/)
  let args = [n]
  if (ordArg) args.push(type === 'ordinal')
  if (compact) {
    const c = Number(compact[2])
    args[0] = Number(compact[1]) * Math.pow(10, c)
    args.push(c)
  }
  try {
    var r = fn(...args)
  } catch (error) {
    /* istanbul ignore next: should not happen unless CLDR data is broken */
    throw new Error(errorMsg(lc, n, type, fn, args, error))
  }
  if (r !== expResult) {
    const res = JSON.stringify(r)
    const exp = JSON.stringify(expResult)
    throw new Error(
      errorMsg(lc, n, type, fn, args, `was ${res}, expected ${exp}`)
    )
  }
}

export function testCat(lc, fn, ordArg, type, cat, values) {
  for (const n of values) {
    testCond(lc, fn, ordArg, n, type, cat)
    if (!n.includes('c') && !/\.0+$/.test(n))
      testCond(lc, fn, ordArg, Number(n), type, cat)
  }
}

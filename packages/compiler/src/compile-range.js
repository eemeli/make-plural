const CAT = ['zero', 'one', 'two', 'few', 'many', 'other']

function parseKey(key) {
  const match = key.match(/^pluralRange-start-(\w+)-end-(\w+)$/)
  if (!match)
    throw new Error(`Plural range key does not match expected form: ${key}`)
  const [, start, end] = match
  if (!CAT.includes(start) || !CAT.includes(end))
    throw new Error(`Unsupported plural category in plural range key: ${key}`)
  return [start, end]
}

function buildResult(data) {
  let allOther = true
  let allStart = true
  let allEnd = true
  const tests = []
  if (data) {
    for (const [key, result] of Object.entries(data)) {
      const [start, end] = parseKey(key)
      if (!CAT.includes(result))
        throw new Error(
          `Unsupported plural category as plural range result: ${result}`
        )
      if (allOther && result !== 'other') allOther = false
      if (allStart && result !== start) allStart = false
      if (allEnd && result !== end) allEnd = false
      tests.push({ start, end, result })
    }
  }

  if (allOther) return '"other"'
  if (allStart) return 'start || "other"'
  if (allEnd) return 'end || "other"'

  const lines = []
  const done = []
  for (const { start, end, result } of tests) {
    if (result === 'other' || done.includes(end)) continue
    if (tests.filter(t => t.end === end).every(t => t.result === result)) {
      lines.push(`end === "${end}" ? "${result}"`)
      done.push(end)
    } else {
      lines.push(`(start === "${start}" && end === "${end}") ? "${result}"`)
    }
  }
  lines.push('"other"')
  return lines.length < 4 ? lines.join(' : ') : '(\n  ' + lines.join('\n  : ') + '\n)'
}

/**
 * Compiles Unicode CLDR plural range data into a corresponding JavaScript function
 *
 * @typedef {'zero'|'one'|'two'|'few'|'many'|'other'} Category - One of the valid
 *   CLDR plural cateogries: `'zero' | 'one' | 'two' | 'few' | 'many' | 'other'`
 * @param {Record<string, Category>} [data] - Plural range data, with keys matching
 *   the regular expression `^pluralRange-start-(\w+)-end-(\w+)$`.
 * @returns {(start: Category, end: Category) => Category} A function, which when
 *   given a `start` and an `end` category, determines the plural category of the
 *   entire range.
 */
export function compileRange(data) {
  const args = 'start, end'
  const res = buildResult(data)
  const fn = new Function(args, `return ${res};`)
  fn.toString = () => `(${args}) => ${res}`
  return fn
}

import { identifier } from 'safe-identifier'
import getCompiler from './get-compiler'
import printUMD from './print-umd'

export default function printPluralsModule(args) {
  const MakePlural = getCompiler(args)
  const { cardinals, locale, maxRepeat, umd } = args
  const locales =
    locale.length === 0
      ? Object.keys(MakePlural.rules[cardinals ? 'cardinal' : 'ordinal'])
      : locale.sort()

  const localesByFn = {}
  for (const lc of locales) {
    const mpc = new MakePlural(lc)
    const fn = mpc.compile().toString()
    mpc.test()
    const id = identifier(lc)
    const prev = localesByFn[fn]
    if (prev) prev.push(id)
    else localesByFn[fn] = [id]
  }

  let str = ''
  let commonId = 'a'
  const plurals = []
  for (const [fn, locales] of Object.entries(localesByFn)) {
    if (locales.length > maxRepeat && commonId <= 'z') {
      str += fn.replace(/^function\b/, `function ${commonId}`) + '\n'
      for (const lc of locales) plurals.push({ lc, id: commonId })
      commonId = String.fromCharCode(commonId.charCodeAt(0) + 1)
    } else {
      for (const lc of locales) {
        plurals.push({ lc, fn: fn.replace(/^function\b/, `function ${lc}`) })
      }
    }
  }
  plurals.sort((a, b) => (a.lc < b.lc ? -1 : 1))
  if (str) str += '\n'

  if (umd) {
    const pm = plurals.map(({ lc, id, fn }) => `${lc}: ${id || fn}`)
    str += printUMD('plurals', pm.join(',\n\n')) + '\n'
  } else {
    for (const { lc, id, fn } of plurals) {
      if (id) str += `export const ${lc} = ${id};\n`
      else str += `export ${fn}\n`
    }
  }
  return str
}

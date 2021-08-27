import data from 'cldr-core/supplemental/pluralRanges.json'
import { compileRange } from 'make-plural-compiler'
import { identifier } from 'safe-identifier'

import printUMD from './print-umd.js'

const pluralRanges = data.supplemental.plurals

export default function printRangesModule(args) {
  const { dts, locale, maxRepeat, umd } = args
  const locales =
    locale.length === 0 ? Object.keys(pluralRanges) : locale.sort()

  if (dts) {
    let str =
      'export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";\n\n'
    const args = 'start: PluralCategory, end: PluralCategory'
    for (const lc of locales) {
      const id = identifier(lc)
      const rc = {
        zero: false,
        one: false,
        two: false,
        few: false,
        many: false,
        other: false
      }
      for (const pc of Object.values(pluralRanges[lc])) rc[pc] = true
      const sc = Object.entries(rc)
        .filter(e => e[1])
        .map(e => JSON.stringify(e[0]))
      str += `export const ${id}: (${args}) => ${sc.join(' | ')};\n`
    }
    return str
  }

  const localesByFn = {}
  for (const lc of locales) {
    const fn = compileRange(pluralRanges[lc]).toString()
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
      str += `const ${commonId} = ${fn};\n`
      for (const lc of locales) plurals.push({ lc, id: commonId })
      commonId = String.fromCharCode(commonId.charCodeAt(0) + 1)
    } else {
      for (const lc of locales) plurals.push({ lc, fn })
    }
  }
  plurals.sort((a, b) => (a.lc < b.lc ? -1 : 1))
  if (str) str += '\n'

  if (umd) {
    const pm = plurals.map(({ lc, id, fn }) => `${lc}: ${id || fn}`)
    str += printUMD('pluralRanges', pm.join(',\n\n')) + '\n'
  } else {
    for (const { lc, id, fn } of plurals)
      str += `export const ${lc} = ${id || fn};\n`
  }
  return str
}

import { identifier } from 'safe-identifier'
import getCompiler from './get-compiler.js'
import printUMD from './print-umd.js'

export default function printExamplesModule(args) {
  const MakePlural = getCompiler(args)
  const { locale, dts, maxRepeat, umd } = args
  const locales =
    locale.length === 0 ? Object.keys(MakePlural.rules.cardinal) : locale.sort()

  const localesByExample = {}
  for (const lc of locales) {
    const mpc = new MakePlural(lc)
    mpc.compile()
    mpc.test()
    const ex = JSON.stringify(mpc.examples)
    const id = identifier(lc)
    const prev = localesByExample[ex]
    if (prev) prev.push(id)
    else localesByExample[ex] = [id]
  }

  let str = ''
  let commonId = 'a'
  const examples = []
  for (const [ex, locales] of Object.entries(localesByExample)) {
    if (!dts && locales.length > maxRepeat && commonId <= 'z') {
      str += `const ${commonId} = ${ex};\n`
      for (const lc of locales) examples.push({ lc, ex: commonId })
      commonId = String.fromCharCode(commonId.charCodeAt(0) + 1)
    } else {
      for (const lc of locales) examples.push({ lc, ex })
    }
  }
  examples.sort((a, b) => (a.lc < b.lc ? -1 : 1))
  if (str) str += '\n'

  if (dts) {
    for (const { lc, ex } of examples) str += `export const ${lc}: ${ex};\n`
  } else if (umd) {
    const cm = examples.map(({ lc, ex }) => `${lc}: ${ex}`)
    str += printUMD('pluralCategories', cm.join(',\n')) + '\n'
  } else {
    for (const { lc, ex } of examples) str += `export const ${lc} = ${ex};\n`
  }
  return str
}

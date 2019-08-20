import { identifier } from 'safe-identifier'
import * as common from './common'
import getCompiler from './get-compiler'
import printUMD from './print-umd'

export default function printCategoriesModule(args) {
  const MakePlural = getCompiler(args)
  const { locale, ordinals, umd } = args
  const locales =
    locale.length === 0 ? Object.keys(MakePlural.rules.cardinal) : locale.sort()
  const commonCategories = ordinals
    ? common.combined.categories
    : common.cardinals.categories

  const usedCommonCategories = {}
  const categories = locales.map(lc => {
    const mpc = new MakePlural(lc)
    mpc.compile()
    mpc.test()
    const cat = JSON.stringify(mpc.categories).replace(/"(\w+)":/g, '$1:')
    const i = commonCategories.indexOf(cat)
    if (i === -1) {
      return [lc, cat]
    } else {
      usedCommonCategories[i] = true
      return [lc, `_${i}`]
    }
  })

  const varType = umd ? 'var' : 'const'
  let str = ''
  for (let i = 0; i < commonCategories.length; ++i) {
    if (usedCommonCategories[i])
      str += `${varType} _${i} = ${commonCategories[i]};\n`
  }
  if (str) str += '\n'
  if (umd) {
    const cm = categories.map(([lc, cat]) => `${identifier(lc)}: ${cat}`)
    str += printUMD('pluralCategories', cm.join(',\n')) + '\n'
  } else {
    for (const [lc, cat] of categories) {
      const id = identifier(lc)
      str += `export const ${id} = ${cat};\n`
    }
  }
  return str
}

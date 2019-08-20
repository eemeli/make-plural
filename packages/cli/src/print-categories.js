import { identifier } from 'safe-identifier'
import { cardinalCategories, combinedCategories } from './common-categories'
import getCompiler from './get-compiler'
import printUMD from './print-umd'

const NAMES = { zero: 'z', one: 'o', two: 't', few: 'f', many: 'm', other: 'x' }

function stringifyCategories({ cardinal, ordinal }) {
  function catList(list) {
    const vars = list.map(name => NAMES[name])
    return vars.join(',')
  }
  return `{cardinal:[${catList(cardinal)}],ordinal:[${catList(ordinal)}]}`
}

export default function printCategoriesModule(args) {
  const MakePlural = getCompiler(args)
  const { locale, ordinals, umd } = args
  const locales =
    locale.length === 0 ? Object.keys(MakePlural.rules.cardinal) : locale.sort()
  const commonCategories = ordinals ? combinedCategories : cardinalCategories

  const usedCommonCategories = {}
  const categories = locales.map(lc => {
    const mpc = new MakePlural(lc)
    mpc.compile()
    mpc.test()
    const cat = stringifyCategories(mpc.categories)
    const i = commonCategories.indexOf(cat)
    if (i === -1) {
      return [lc, cat]
    } else {
      usedCommonCategories[i] = true
      return [lc, `_${i}`]
    }
  })

  const varType = umd ? 'var' : 'const'
  const varNames = Object.keys(NAMES).map(name => `${NAMES[name]} = "${name}"`)
  let str = `${varType} ${varNames.join(', ')};\n`
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

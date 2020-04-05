import { identifier } from 'safe-identifier'
import getCompiler from './get-compiler'

function stringifyCategories({ cardinals, ordinals }, categories) {
  const has = {
    zero: false,
    one: false,
    two: false,
    few: false,
    many: false,
    other: false
  }
  if (cardinals) for (const cat of categories.cardinal) has[cat] = true
  if (ordinals) for (const cat of categories.ordinal) has[cat] = true
  return Object.keys(has)
    .filter(key => has[key])
    .map(JSON.stringify)
    .join(' | ')
}

export default function printPluralTypes(args) {
  const MakePlural = getCompiler(args)
  const { cardinals, locale, ordinals } = args
  let fnArgs = 'n: number | string'
  if (cardinals && ordinals) fnArgs += ', ord?: boolean'
  const locales =
    locale.length === 0
      ? Object.keys(MakePlural.rules[cardinals ? 'cardinal' : 'ordinal'])
      : locale.sort()

  let str = ''
  for (const lc of locales) {
    const mpc = new MakePlural(lc)
    mpc.compile()
    mpc.test()
    const id = identifier(lc)
    const cat = stringifyCategories(args, mpc.categories)
    str += `export function ${id}(${fnArgs}): ${cat};\n`
  }
  return str
}

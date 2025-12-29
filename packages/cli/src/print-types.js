import { identifier } from 'safe-identifier'
import getCompiler from './get-compiler.js'

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
  const { cardinals, locale } = args
  const locales =
    locale.length === 0
      ? Object.keys(MakePlural.rules[cardinals ? 'cardinal' : 'ordinal'])
      : locale.sort()

  let str =
    'export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";\n\n'
  for (const lc of locales) {
    const mpc = new MakePlural(lc)
    mpc.compile()
    mpc.test()
    const id = identifier(lc)
    const fnArgs = mpc.functionArgs().map(arg => {
      switch (arg) {
        case 'n':
          return 'n: number | string'
        case 'ord':
          return 'ord?: boolean'
        case 'c':
          return 'c?: number'
        default:
          throw new Error(
            `Unsupported selector argument for locale ${lc}: ${arg}`
          )
      }
    })
    const cat = stringifyCategories(args, mpc.categories)
    str += `export const ${id}: (${fnArgs.join(', ')}) => ${cat};\n`
  }
  return str
}

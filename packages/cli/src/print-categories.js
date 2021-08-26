import { identifier } from 'safe-identifier'
import getCompiler from './get-compiler.js'
import printUMD from './print-umd.js'

const NAMES = { zero: 'z', one: 'o', two: 't', few: 'f', many: 'm', other: 'x' }

function stringifyCategories(useVars, { cardinal, ordinal }) {
  function catList(list) {
    const vars = list.map(name =>
      useVars ? NAMES[name] : JSON.stringify(name)
    )
    return vars.join(',')
  }
  return `{cardinal:[${catList(cardinal)}],ordinal:[${catList(ordinal)}]}`
}

export default function printCategoriesModule(args) {
  const MakePlural = getCompiler(args)
  const { locale, dts, maxRepeat, umd } = args
  const locales =
    locale.length === 0 ? Object.keys(MakePlural.rules.cardinal) : locale.sort()

  const localesByCat = {}
  for (const lc of locales) {
    const mpc = new MakePlural(lc)
    mpc.compile()
    mpc.test()
    const cat = stringifyCategories(!dts, mpc.categories)
    const id = identifier(lc)
    const prev = localesByCat[cat]
    if (prev) prev.push(id)
    else localesByCat[cat] = [id]
  }

  const varType = umd ? 'var' : 'const'
  const varNames = Object.keys(NAMES).map(name => `${NAMES[name]} = "${name}"`)
  let str = `${varType} ${varNames.join(', ')};\n`
  let commonId = 'a'
  const categories = []
  for (const [cat, locales] of Object.entries(localesByCat)) {
    if (!dts && locales.length > maxRepeat && commonId <= 'z') {
      str += `${varType} ${commonId} = ${cat};\n`
      for (const lc of locales) categories.push({ lc, cat: commonId })
      do {
        commonId = String.fromCharCode(commonId.charCodeAt(0) + 1)
      } while (Object.values(NAMES).includes(commonId))
    } else {
      for (const lc of locales) categories.push({ lc, cat })
    }
  }
  categories.sort((a, b) => (a.lc < b.lc ? -1 : 1))
  if (str) str += '\n'

  if (dts) {
    str =
      'export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";\n\n'
    for (const { lc, cat } of categories) str += `export const ${lc}: ${cat};\n`
  } else if (umd) {
    const cm = categories.map(({ lc, cat }) => `${lc}: ${cat}`)
    str += printUMD('pluralCategories', cm.join(',\n')) + '\n'
  } else {
    for (const { lc, cat } of categories)
      str += `export const ${lc} = ${cat};\n`
  }
  return str
}

import aliases from 'cldr-core/supplemental/aliases.json'
import { identifier } from 'safe-identifier'
import * as common from './common'
import getCompiler from './get-compiler'
import printUMD from './print-umd'

function getAlias(MakePlural, lc) {
  const alias = aliases.supplemental.metadata.alias.languageAlias[lc]
  if (!alias) return null
  const r = alias._replacement
  return MakePlural.rules.cardinal[r] ? r : null // https://unicode-org.atlassian.net/browse/CLDR-13227
}

export default function printPluralsModule(args) {
  const MakePlural = getCompiler(args)
  const { cardinals, locale, ordinals, umd } = args
  const locales =
    locale.length === 0 ? Object.keys(MakePlural.rules.cardinal) : locale.sort()
  const commonPlurals =
    cardinals && ordinals ? common.combined.plurals : common.cardinals.plurals

  const aliased = []
  const usedCommonPlurals = {}
  const plurals = locales.map(lc => {
    const alias = getAlias(MakePlural, lc)
    if (alias) {
      aliased.push([lc, alias])
      return [lc, alias]
    }
    const mpc = new MakePlural(lc)
    const fn = mpc.compile().toString()
    mpc.test()
    const i = commonPlurals.indexOf(fn)
    if (i === -1) {
      return [lc, fn.replace(/^function\b/, `function ${identifier(lc)}`)]
    } else {
      usedCommonPlurals[i] = true
      return [lc, `_${i}`]
    }
  })

  let str = ''
  for (let i = 0; i < commonPlurals.length; ++i) {
    if (usedCommonPlurals[i])
      str += commonPlurals[i].replace(/^function\b/, `function _${i}`) + '\n'
  }
  for (const [src, tgt] of aliased) {
    const idx = plurals.findIndex(pl => pl[0] === tgt)
    const [lc, fn] = plurals[idx]
    if (fn.startsWith('_')) {
      const jdx = plurals.findIndex(pl => pl[0] === src)
      plurals[jdx][1] = fn
    } else if (umd) {
      str += `${fn}\n`
      plurals[idx][1] = identifier(lc)
    }
  }
  if (str) str += '\n'
  if (umd) {
    const pm = plurals.map(([lc, fn]) => `${identifier(lc)}: ${fn}`)
    str += printUMD('plurals', pm.join(',\n\n')) + '\n'
  } else {
    for (const [lc, fn] of plurals) {
      if (fn.startsWith('function')) {
        str += `export ${fn}\n`
      } else {
        const id = identifier(lc)
        str += `export const ${id} = ${fn};\n`
      }
    }
  }
  return str
}

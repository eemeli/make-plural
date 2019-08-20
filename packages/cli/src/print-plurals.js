import aliases from 'cldr-core/supplemental/aliases.json'
import { identifier } from 'safe-identifier'
import * as common from './common'
import umd from './print-umd'

function getAlias(MakePlural, lc) {
  const alias = aliases.supplemental.metadata.alias.languageAlias[lc]
  if (!alias) return null
  const r = alias._replacement
  return MakePlural.rules.cardinal[r] ? r : null // https://unicode-org.atlassian.net/browse/CLDR-13227
}

export default function printPluralsModule(MakePlural, { es6 }) {
  const { plurals: cp } = MakePlural.ordinals
    ? common.combined
    : common.cardinals
  const aliased = []
  const plurals = Object.keys(MakePlural.rules.cardinal).map(lc => {
    const alias = getAlias(MakePlural, lc)
    if (alias) {
      aliased.push([lc, alias])
      return [lc, alias]
    }
    const mpc = new MakePlural(lc)
    const fn = mpc.compile().toString()
    mpc.test()
    const i = cp.indexOf(fn)
    return [
      lc,
      i === -1
        ? fn.replace(/^function\b/, `function ${identifier(lc)}`)
        : `_${i}`
    ]
  })

  let str = ''
  for (let i = 0; i < cp.length; ++i) {
    str += cp[i].replace(/^function\b/, `function _${i}`) + '\n'
  }
  for (const [src, tgt] of aliased) {
    const idx = plurals.findIndex(pl => pl[0] === tgt)
    process.stderr.write(JSON.stringify({ tgt, idx }) + '\n')
    const [lc, fn] = plurals[idx]
    if (fn.startsWith('_')) {
      const jdx = plurals.findIndex(pl => pl[0] === src)
      plurals[jdx][1] = fn
    } else if (!es6) {
      str += `${fn}\n`
      plurals[idx][1] = identifier(lc)
    }
  }
  str += '\n'
  if (es6) {
    for (const [lc, fn] of plurals) {
      if (fn.startsWith('function')) {
        str += `export ${fn}\n`
      } else {
        const id = identifier(lc)
        str += `export const ${id} = ${fn};\n`
      }
    }
  } else {
    const pm = plurals.map(([lc, fn]) => `${identifier(lc)}: ${fn}`)
    str += umd('plurals', pm.join(',\n\n')) + '\n'
  }
  return str
}

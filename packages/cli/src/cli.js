#!/usr/bin/env node

/** A compiler for make-plural.js
 *
 *  Usage:
 *    ./bin/make-plural                 // checks all locale rules
 *    ./bin/make-plural [lc]            // prints the locale function for LC
 *    ./bin/make-plural [lc] [n] [ord]  // prints the (ORD ? ordinal : plural) category for N in locale LC
 */

import aliases from 'cldr-core/supplemental/aliases.json'
import pluralData from 'cldr-core/supplemental/plurals.json'
import ordinalData from 'cldr-core/supplemental/ordinals.json'
import { source } from 'common-tags'
import MakePluralCompiler from 'make-plural-compiler'
import minimist from 'minimist'
import { identifier } from 'safe-identifier'
import * as common from './common'

const MakePlural = MakePluralCompiler.load(pluralData, ordinalData)

var argv = minimist(process.argv.slice(2), {
  default: {
    locale: null,
    value: null,
    ordinal: null,
    cardinal: null,
    categories: false,
    es6: false,
    width: null
  },
  alias: {
    locale: 'l',
    value: 'v',
    ordinal: 'o',
    cardinal: 'c',
    es6: 'e',
    width: 'w'
  },
  string: ['locale', 'value', 'width'],
  boolean: ['categories', 'es6']
})

function write(str, end) {
  process.stdout.write(str)
  if (end) process.stdout.write(end)
}

const { languageAlias } = aliases.supplemental.metadata.alias
function getAlias(lc) {
  const alias = languageAlias[lc]
  if (!alias) return null
  const r = alias._replacement
  return MakePlural.rules.cardinal[r] ? r : null // https://unicode-org.atlassian.net/browse/CLDR-13227
}

// UMD pattern adapted from https://github.com/umdjs/umd/blob/master/returnExports.js
const umd = (global, value) => source`
  (function (root, ${global}) {
    if (typeof define === 'function' && define.amd) {
      define(${global});
    } else if (typeof exports === 'object') {
      module.exports = ${global};
    } else {
      root.${global} = ${global};
    }
  }(this, {
  ${value}
  }));
`

function printPluralsModule(es6) {
  const { plurals: cp } = MakePlural.ordinals
    ? common.combined
    : common.cardinals
  const aliased = []
  const plurals = Object.keys(MakePlural.rules.cardinal).map(lc => {
    const alias = getAlias(lc)
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
  for (let i = 0; i < cp.length; ++i) {
    write(cp[i].replace(/^function\b/, `function _${i}`), '\n')
  }
  for (const [src, tgt] of aliased) {
    const idx = plurals.findIndex(pl => pl[0] === tgt)
    process.stderr.write(JSON.stringify({ tgt, idx }) + '\n')
    const [lc, fn] = plurals[idx]
    if (fn.startsWith('_')) {
      const jdx = plurals.findIndex(pl => pl[0] === src)
      plurals[jdx][1] = fn
    } else if (!es6) {
      write(fn, '\n')
      plurals[idx][1] = identifier(lc)
    }
  }
  write('\n')
  if (es6) {
    for (const [lc, fn] of plurals) {
      if (fn.startsWith('function')) {
        write(`export ${fn}`, '\n')
      } else {
        const id = identifier(lc)
        write(`export const ${id} = ${fn};`, '\n')
      }
    }
  } else {
    const pm = plurals.map(([lc, fn]) => `${identifier(lc)}: ${fn}`)
    write(umd('plurals', pm.join(',\n\n')), '\n')
  }
}

function printCategoriesModule(es6) {
  const { categories: cc } = MakePlural.ordinals
    ? common.combined
    : common.cardinals
  const categories = Object.keys(MakePlural.rules.cardinal).map(lc => {
    const mpc = new MakePlural(lc)
    mpc.compile()
    mpc.test()
    const cat = JSON.stringify(mpc.categories).replace(/"(\w+)":/g, '$1:')
    const i = cc.indexOf(cat)
    return [lc, i === -1 ? cat : `_${i}`]
  })
  if (es6) {
    write(cc.map((c, i) => `const _${i} = ${c};`).join('\n'), '\n\n')
    for (const [lc, cat] of categories) {
      const id = identifier(lc)
      write(`export const ${id} = ${cat};`, '\n')
    }
  } else {
    write(cc.map((c, i) => `var _${i} = ${c};`).join('\n'), '\n\n')
    const cm = categories.map(([lc, cat]) => `${identifier(lc)}: ${cat}`)
    write(umd('pluralCategories', cm.join(',\n')), '\n')
  }
}

function truthy(v) {
  if (v === '0' || v === 'false') return false
  return !!v
}

argv._.forEach(a => {
  if (argv.locale === null) argv.locale = a
  else if (argv.value === null) argv.value = a
  else if (argv.ordinal === null) argv.ordinal = a
})

MakePlural.cardinals = argv.cardinal !== null ? truthy(argv.cardinal) : true
MakePlural.ordinals = argv.ordinal !== null ? truthy(argv.ordinal) : true
const foldWidth = Number(argv.width)
if (foldWidth > 0) MakePlural.foldWidth = foldWidth

if (argv.locale) {
  const mpc = new MakePlural(argv.locale)
  const mp = mpc.compile()
  mpc.test()
  if (argv.categories) {
    const cats = mpc.categories.cardinal
      .concat(mpc.categories.ordinal)
      .filter((v, i, self) => self.indexOf(v) === i)
    write(cats.join(', '))
  } else if (argv.value !== null) {
    write(mp(argv.value, truthy(argv.ordinal)))
  } else {
    write(mp.toString(argv.locale))
  }
} else {
  if (argv.categories) {
    printCategoriesModule(argv.es6)
  } else {
    printPluralsModule(argv.es6)
  }
}

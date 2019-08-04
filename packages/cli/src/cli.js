#!/usr/bin/env node

/** A compiler for make-plural.js
 *
 *  Usage:
 *    ./bin/make-plural                 // checks all locale rules
 *    ./bin/make-plural [lc]            // prints the locale function for LC
 *    ./bin/make-plural [lc] [n] [ord]  // prints the (ORD ? ordinal : plural) category for N in locale LC
 */

import { source } from 'common-tags'
import { identifier, property } from 'safe-identifier'
import * as common from './common'

var argv = require('minimist')(process.argv.slice(2), {
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

const pluralData = require('cldr-core/supplemental/plurals.json')
const ordinalData = require('cldr-core/supplemental/ordinals.json')
const MakePlural = require('make-plural-compiler').load(pluralData, ordinalData)

function write(str, end) {
  process.stdout.write(str)
  if (end) process.stdout.write(end)
}

const es6module = value => source`
  export default {
    ${value}
  }
`

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
  const plurals = Object.keys(MakePlural.rules.cardinal).map(lc => {
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
    write(cp[i].replace(/^function\b/, `function _${i}`), '\n\n')
  }
  if (es6) {
    const exp = []
    for (const [lc, fn] of plurals) {
      const id = identifier(lc)
      const prop = property(null, lc)
      if (fn[0] === '_') {
        write(`export const ${id} = ${fn};`, '\n')
      } else {
        write(`export ${fn}`, '\n')
      }
      exp.push(id === prop ? id : `${prop}: ${id}`)
    }
    write('\n')
    write(es6module(exp.join(',\n')), '\n')
  } else {
    const pm = plurals.map(([lc, fn]) => `${property(null, lc)}: ${fn}`)
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
    const cm = []
    for (const [lc, cat] of categories) {
      const id = identifier(lc)
      const prop = property(null, lc)
      write(`export const ${id} = ${cat};`, '\n')
      cm.push(id === prop ? id : `${prop}: ${id}`)
    }
    write('\n')
    write(es6module(cm.join(',\n')), '\n')
  } else {
    write(cc.map((c, i) => `var _${i} = ${c};`).join('\n'), '\n\n')
    const cm = categories.map(([lc, cat]) => `${property(null, lc)}: ${cat}`)
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
    console.log(cats.join(', '))
  } else if (argv.value !== null) {
    console.log(mp(argv.value, truthy(argv.ordinal)))
  } else {
    console.log(mp.toString(argv.locale))
  }
} else {
  if (argv.categories) {
    printCategoriesModule(argv.es6)
  } else {
    printPluralsModule(argv.es6)
  }
}

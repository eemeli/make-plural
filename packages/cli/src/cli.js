#!/usr/bin/env node

/** A compiler for make-plural.js
 *
 *  Usage:
 *    ./bin/make-plural                 // checks all locale rules
 *    ./bin/make-plural [lc]            // prints the locale function for LC
 *    ./bin/make-plural [lc] [n] [ord]  // prints the (ORD ? ordinal : plural) category for N in locale LC
 */

import { source } from 'common-tags'
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
  alias: { locale: 'l', value: 'v', ordinal: 'o', cardinal: 'c', es6: 'e', width: 'w' },
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

function mapForEachLanguage(cb, opt) {
  const style = opt && !opt.cardinals ? 'ordinal' : 'cardinal'
  let languages = []
  for (let lc in MakePlural.rules[style]) {
    const key =
      /^[A-Z_$][0-9A-Z_$]*$/i.test(lc) && lc !== 'in' ? lc : JSON.stringify(lc)
    const mpc = new MakePlural(lc, opt)
    languages.push(key + ': ' + cb(mpc))
  }
  return languages
}

function printPluralsModule(es6) {
  const cp = common[MakePlural.ordinals ? 'combined' : 'cardinals'].plurals
  const plurals = mapForEachLanguage(mpc => {
    let fn = mpc.compile().toString()
    mpc.test()
    cp.forEach(function(p, i) {
      if (fn === p) fn = `C[${i}]`
    })
    return fn
  })
  if (es6) {
    write(source`
      const C = [
      ${cp.join(',\n')}
      ];
    `, '\n\n')
    write(es6module(plurals.join(',\n\n')), '\n')
  } else {
    write(source`
      var C = [
      ${cp.join(',\n')}
      ];
    `, '\n\n')
    write(umd('plurals', plurals.join(',\n\n')), '\n')
  }
}

function printCategoriesModule(es6) {
  const cc = common[MakePlural.ordinals ? 'combined' : 'cardinals'].categories
  const categories = mapForEachLanguage(mpc => {
    mpc.compile()
    mpc.test()
    let cat = JSON.stringify(mpc.categories).replace(/"(\w+)":/g, '$1:')
    cc.forEach(function(c, i) {
      if (cat === c) cat = `_cc[${i}]`
    })
    return cat
  })
  if (es6) {
    write('const _cc = [\n  ' + cc.join(',\n  ') + '\n];', '\n\n')
    write(es6module(categories.join(',\n')), '\n')
  } else {
    write('var _cc = [\n  ' + cc.join(',\n  ') + '\n];', '\n\n')
    write(umd('pluralCategories', categories.join(',\n')), '\n')
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

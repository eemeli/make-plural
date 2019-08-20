#!/usr/bin/env node

/** A compiler for make-plural.js
 *
 *  Usage:
 *    ./bin/make-plural                 // checks all locale rules
 *    ./bin/make-plural [lc]            // prints the locale function for LC
 *    ./bin/make-plural [lc] [n] [ord]  // prints the (ORD ? ordinal : plural) category for N in locale LC
 */

import pluralData from 'cldr-core/supplemental/plurals.json'
import ordinalData from 'cldr-core/supplemental/ordinals.json'
import MakePluralCompiler from 'make-plural-compiler'
import minimist from 'minimist'
import printCategoriesModule from './print-categories'
import printPluralsModule from './print-plurals'

function getArguments() {
  var args = minimist(process.argv.slice(2), {
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
    boolean: ['categories', 'es6', 'module']
  })
  args._.forEach(a => {
    if (args.locale === null) args.locale = a
    else if (args.value === null) args.value = a
    else if (args.ordinal === null) args.ordinal = a
  })
  return args
}

function truthy(v) {
  if (v === '0' || v === 'false') return false
  return !!v
}

function printResult(MakePlural, { categories, locale, ordinal, value }) {
  const mpc = new MakePlural(locale)
  const mp = mpc.compile()
  mpc.test()

  if (categories) {
    const cats = mpc.categories.cardinal
      .concat(mpc.categories.ordinal)
      .filter((v, i, self) => self.indexOf(v) === i)
    return cats.join(', ')
  } else if (value !== null) {
    return mp(value, truthy(ordinal))
  } else {
    return mp.toString(locale)
  }
}

function main(args) {
  const { cardinal, categories, locale, ordinal, width } = args

  const MakePlural = MakePluralCompiler.load(pluralData, ordinalData)
  MakePlural.cardinals = cardinal !== null ? truthy(cardinal) : true
  MakePlural.ordinals = ordinal !== null ? truthy(ordinal) : true
  const foldWidth = Number(width)
  if (foldWidth > 0) MakePlural.foldWidth = foldWidth

  let str
  if (locale) {
    str = printResult(MakePlural, args)
  } else {
    if (categories) {
      str = printCategoriesModule(MakePlural, args)
    } else {
      str = printPluralsModule(MakePlural, args)
    }
  }
  process.stdout.write(str)
}

main(getArguments())

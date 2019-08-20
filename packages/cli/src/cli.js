#!/usr/bin/env node

import pluralData from 'cldr-core/supplemental/plurals.json'
import ordinalData from 'cldr-core/supplemental/ordinals.json'
import MakePluralCompiler from 'make-plural-compiler'
import yargs from 'yargs'
import printCategoriesModule from './print-categories'
import printPluralsModule from './print-plurals'

function buildMakePlural({ cardinals, ordinals, width }) {
  const MakePlural = MakePluralCompiler.load(pluralData, ordinalData)
  MakePlural.cardinals = cardinals
  MakePlural.ordinals = ordinals
  if (width > 0) MakePlural.foldWidth = width
  return MakePlural
}

function valueCommand(type) {
  const valueDesc = `A numerical value. If left empty, all ${type} plural categories will be printed.`
  return {
    command: `${type} [value]`,
    desc: `Print the ${type} plural category of a value`,
    builder: yargs =>
      yargs.positional('value', { desc: valueDesc }).option('locale', {
        alias: 'l',
        desc: 'Locale identifer',
        type: 'string'
      }),
    handler({ locale, value }) {
      const MakePlural = buildMakePlural({
        cardinals: type === 'cardinal',
        ordinals: type === 'ordinal'
      })
      const mpc = new MakePlural(locale)
      const mp = mpc.compile() // also fills mpc.categories
      const res = value == null ? mpc.categories[type].join(', ') : mp(value)
      process.stdout.write(res)
    }
  }
}

const moduleOptions = {
  cardinals: {
    default: true,
    desc: 'Include cardinal plurals',
    type: 'boolean'
  },
  ordinals: {
    default: true,
    desc: 'Include ordinal plurals',
    type: 'boolean'
  },
  umd: {
    desc: 'Output an UMD rather than an ES module',
    type: 'boolean'
  },
  width: {
    alias: 'w',
    desc: 'Fold width for the output',
    type: 'number'
  }
}

yargs
  .command(valueCommand('cardinal'))
  .command(valueCommand('ordinal'))
  .command({
    command: 'plurals',
    desc: 'Print the plural functions as the source of a JS module',
    builder: yargs => yargs.options(moduleOptions),
    handler(args) {
      const MakePlural = buildMakePlural(args)
      const str = printPluralsModule(MakePlural, args)
      process.stdout.write(str)
    }
  })
  .command({
    command: 'categories',
    desc: 'Print the plural categories as the source of a JS module',
    builder: yargs => yargs.options(moduleOptions),
    handler(args) {
      const MakePlural = buildMakePlural(args)
      const str = printCategoriesModule(MakePlural, args)
      process.stdout.write(str)
    }
  })
  .help()
  .wrap(Math.min(96, yargs.terminalWidth()))
  .parse()

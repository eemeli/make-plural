#!/usr/bin/env node

import yargs from 'yargs'
import getCompiler from './get-compiler.js'
import printCategoriesModule from './print-categories.js'
import printPluralsModule from './print-plurals.js'
import printRangesModule from './print-ranges.js'
import printPluralTypes from './print-types.js'

function valueCommand(type, alias) {
  const aliases = alias ? [alias] : null
  const valueDesc = `A numerical value. If left empty, all ${type} plural categories will be printed.`
  return {
    aliases,
    command: `${type} [value]`,
    desc: `Print the ${type} plural category of a value`,
    builder: yargs =>
      yargs.positional('value', { desc: valueDesc }).option('locale', {
        alias: 'l',
        desc: 'Locale identifer',
        type: 'string'
      }),
    handler({ locale, value }) {
      const MakePlural = getCompiler({
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

const moduleCommandBuilder = yargs =>
  yargs
    .positional('locale', {
      desc: 'Identifiers for locales to include in the module. If left empty, all available locales will be included.'
    })
    .options({
      cardinals: {
        default: true,
        desc: 'Include cardinal plurals',
        type: 'boolean'
      },
      dts: {
        desc: 'Output a TypeScript d.ts file',
        type: 'boolean'
      },
      'max-repeat': {
        default: 5,
        desc: 'Maximum number of allowed repeats for plural functions & cagetories',
        type: 'number'
      },
      ordinals: {
        default: true,
        desc: 'Include ordinal plurals',
        type: 'boolean'
      },
      umd: {
        desc: 'Output an UMD rather than an ES module',
        type: 'boolean'
      }
    })

yargs
  .command(valueCommand('cardinal', 'plural'))
  .command(valueCommand('ordinal'))
  .command({
    command: 'plurals [locale...]',
    desc: 'Print the plural functions as the source of a JS module',
    builder: moduleCommandBuilder,
    handler(args) {
      const str = args.dts ? printPluralTypes(args) : printPluralsModule(args)
      process.stdout.write(str)
    }
  })
  .command({
    command: 'ranges [locale...]',
    desc: 'Print the plural range functions as the source of a JS module',
    builder: moduleCommandBuilder,
    handler(args) {
      process.stdout.write(printRangesModule(args))
    }
  })
  .command({
    command: 'categories [locale...]',
    desc: 'Print the plural categories as the source of a JS module',
    builder: moduleCommandBuilder,
    handler(args) {
      process.stdout.write(printCategoriesModule(args))
    }
  })
  .help()
  .wrap(Math.min(96, yargs.terminalWidth()))
  .parse()

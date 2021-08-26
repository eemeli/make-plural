import { expect } from 'chai'
import cardinalData from 'cldr-core/supplemental/plurals.json'
import ordinalData from 'cldr-core/supplemental/ordinals.json'
import { identifier } from 'safe-identifier'

import { Compiler } from 'make-plural-compiler/src/compiler.js'
import { testCat } from 'make-plural-compiler/src/tests.js'
import * as Plurals from 'make-plural/plurals'

Compiler.load(cardinalData, ordinalData)

function testPluralData(type, lc, getPlural) {
  var opt = { cardinals: type == 'cardinal', ordinals: type == 'ordinal' }

  it('has examples', function () {
    const mpc = new Compiler(lc, opt)
    expect(() => mpc.compile()).to.not.throw()
    expect(mpc.examples[type]).to.not.be.empty
  })

  it('is included in the output', function () {
    expect(getPlural(lc)).to.be.an.instanceOf(Function)
  })

  var mpc = new Compiler(lc, opt)
  var mp = mpc.compile()
  for (const [cat, values] of Object.entries(mpc.examples[type])) {
    describe(
      cat + ': ' + Compiler.rules[type][lc]['pluralRule-count-' + cat],
      () => {
        it('Live data', () => {
          testCat(lc, type, cat, values, mp)
        })
        it('Output', () => {
          testCat(lc, type, cat, values, getPlural(lc))
        })
      }
    )
  }
}

describe('MakePlural data self-test (UMD export)', () => {
  const getPlural = lc => Plurals[identifier(lc)]

  describe('Cardinal rules', () => {
    for (var lc in cardinalData.supplemental['plurals-type-cardinal']) {
      describe(lc, () => testPluralData('cardinal', lc, getPlural))
    }
  })

  describe('Ordinal rules', () => {
    for (var lc in ordinalData.supplemental['plurals-type-ordinal']) {
      describe(lc, () => testPluralData('ordinal', lc, getPlural))
    }
  })
})

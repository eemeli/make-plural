import { expect } from 'chai'
import cardinalData from 'cldr-core/supplemental/plurals.json'
import ordinalData from 'cldr-core/supplemental/ordinals.json'

import MakePlural from 'make-plural-compiler/src/compiler'

describe('MakePlural compiler', function() {
  it('should have data members', function() {
    expect(MakePlural).to.have.keys('cardinals', 'ordinals', 'rules')
  })

  describe('.load()', function() {
    it('should require valid parameters', function() {
      expect(MakePlural.load).to.not.throw()
      expect(() => MakePlural.load('')).to.throw()
    })
    it('should load custom CLDR data', function() {
      var cldr = {
        supplemental: {
          'plurals-type-cardinal': {
            xx: {
              'pluralRule-count-one':
                'n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000',
              'pluralRule-count-other':
                ' @integer 0, 2~16, 100, 1000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, …'
            }
          }
        }
      }
      MakePlural.load(cldr)
      expect(MakePlural.rules).to.have.keys('cardinal', 'ordinal')
      expect(MakePlural.rules.cardinal).to.have.key('xx')
    })
    it('should load default CLDR data', function() {
      expect(() => MakePlural.load(cardinalData, ordinalData)).to.not.throw()
      expect(MakePlural.rules).to.have.keys('cardinal', 'ordinal')
      expect(MakePlural.rules.cardinal).to.not.have.any.key('xx')
      expect(MakePlural.rules.cardinal).to.have.any.key('en')
      expect(MakePlural.rules.ordinal).to.have.any.key('en')
    })
    it('should return MakePlural', function() {
      expect(MakePlural.load()).to.equal(MakePlural)
    })
  })

  describe('.getRules()', function() {
    it('should throw for invalid type', function() {
      expect(MakePlural.getRules).to.throw()
      expect(() => MakePlural.getRules('nonesuch', 'xx')).to.throw()
      expect(() => MakePlural.getRules('cardinal', 'xx')).to.not.throw()
    })
    it('should return rules for "cardinal", "en"', function() {
      var en = MakePlural.getRules('cardinal', 'en')
      expect(en).to.be.an('object')
      expect(en).to.have.keys('pluralRule-count-one', 'pluralRule-count-other')
    })
    it('should return the same rules for "cardinal", "EN"', function() {
      var en = MakePlural.getRules('cardinal', 'en')
      var EN = MakePlural.getRules('cardinal', 'EN')
      expect(EN).to.equal(en)
    })
  })

  describe('Compiler()', function() {
    it('should require `new`', function() {
      expect(MakePlural).to.throw(TypeError, /Class/)
    })
    it('should require a locale', function() {
      var new_mp = lc => new MakePlural(lc)
      expect(new_mp).to.throw()
      expect(() => new_mp('en')).to.not.throw()
    })
    it('should return a pluralization function', function() {
      var mp = new MakePlural('en').compile()
      expect(mp).to.be.an.instanceOf(Function)
      expect(mp(1)).to.equal('one')
    })
    it('should handle local options', function() {
      var mp = new MakePlural('en', { ordinals: true }).compile()
      expect(mp(2, true)).to.equal('two')
    })
    it('should handle global options', function() {
      MakePlural.ordinals = true
      var mp = new MakePlural('en').compile()
      expect(mp(2, true)).to.equal('two')
      MakePlural.ordinals = false
    })
  })

  describe('#test()', function() {
    it('should validate default functions', function() {
      var mpc = new MakePlural('en', { ordinals: true })
      var mp = mpc.compile()
      expect(() => mpc.test()).not.to.throw()
    })
    it('should not validate bad functions', function() {
      var cldr = {
          supplemental: {
            'plurals-type-cardinal': {
              xx: {
                'pluralRule-count-one': 'n = 1 @integer 2',
                'pluralRule-count-other': ''
              }
            }
          }
        },
        prevRules = MakePlural.rules
      MakePlural.load(cldr)
      var mpc = new MakePlural('xx')
      var mp = mpc.compile()
      expect(mpc.test).to.throw(/self-test failed/)
      MakePlural.rules = prevRules
    })
  })

  describe('#toString()', function() {
    it('should return a string', function() {
      var mp = new MakePlural('en', { ordinals: true }).compile()
      expect(mp.toString()).to.contain('function')
    })
    it("which can be eval'd as a function", function() {
      var mp = new MakePlural('en', { ordinals: true }).compile()
      var fn = eval('(' + mp.toString() + ')')
      expect(fn).to.be.an.instanceOf(Function)
      expect(fn(1)).to.equal('one')
      expect(fn(2, true)).to.equal('two')
    })
  })
})

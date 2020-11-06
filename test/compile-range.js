import { expect } from 'chai'
import { compileRange } from 'make-plural-compiler/src/compile-range'

describe('valid plural ranges', () => {
  it('no data', () => {
    const fn = compileRange(null)
    expect(fn()).to.equal('other')
    expect(fn('foo', 'bar')).to.equal('other')
    expect(fn('one', 'other')).to.equal('other')
    expect(fn('other', 'other')).to.equal('other')
    expect(fn.toString()).to.equal('(start, end) => "other"')
  })

  it('allOther', () => {
    const data = {
      'pluralRange-start-one-end-other': 'other',
      'pluralRange-start-other-end-one': 'other',
      'pluralRange-start-other-end-other': 'other'
    }
    const fn = compileRange(data)
    expect(fn()).to.equal('other')
    expect(fn('foo', 'bar')).to.equal('other')
    expect(fn('one', 'other')).to.equal('other')
    expect(fn('other', 'other')).to.equal('other')
    expect(fn.toString()).to.equal('(start, end) => "other"')
  })

  it('allEnd', () => {
    const data = {
      'pluralRange-start-one-end-one': 'one',
      'pluralRange-start-one-end-other': 'other',
      'pluralRange-start-other-end-other': 'other'
    }
    const fn = compileRange(data)
    expect(fn()).to.equal('other')
    expect(fn('foo', 'bar')).to.equal('bar')
    expect(fn('other', 'one')).to.equal('one')
    expect(fn('one', 'other')).to.equal('other')
    expect(fn.toString()).to.equal('(start, end) => end || "other"')
  })

  it('allStart', () => {
    const data = {
      'pluralRange-start-one-end-other': 'one',
      'pluralRange-start-other-end-one': 'other',
      'pluralRange-start-other-end-other': 'other'
    }
    const fn = compileRange(data)
    expect(fn()).to.equal('other')
    expect(fn('foo', 'bar')).to.equal('foo')
    expect(fn('one', 'other')).to.equal('one')
    expect(fn('other', 'one')).to.equal('other')
    expect(fn.toString()).to.equal('(start, end) => start || "other"')
  })

  it('ignore start value', () => {
    const data = {
      'pluralRange-start-few-end-few': 'few',
      'pluralRange-start-few-end-one': 'few',
      'pluralRange-start-few-end-other': 'other',
      'pluralRange-start-one-end-few': 'few',
      'pluralRange-start-one-end-other': 'other',
      'pluralRange-start-other-end-few': 'few',
      'pluralRange-start-other-end-other': 'other'
    }
    const fn = compileRange(data)
    expect(fn()).to.equal('other')
    expect(fn('foo', 'bar')).to.equal('other')
    expect(fn('foo', 'one')).to.equal('few')
    expect(fn('one', 'few')).to.equal('few')
    expect(fn('one', 'other')).to.equal('other')
    expect(fn('other', 'other')).to.equal('other')
    expect(fn.toString()).to.equal(
      '(start, end) => end === "few" ? "few" : end === "one" ? "few" : "other"'
    )
  })

  it('do not ignore start value', () => {
    const data = {
      'pluralRange-start-one-end-one': 'other',
      'pluralRange-start-one-end-other': 'other',
      'pluralRange-start-other-end-one': 'one',
      'pluralRange-start-other-end-other': 'other'
    }
    const fn = compileRange(data)
    expect(fn()).to.equal('other')
    expect(fn('foo', 'bar')).to.equal('other')
    expect(fn('foo', 'one')).to.equal('other')
    expect(fn('one', 'other')).to.equal('other')
    expect(fn('other', 'one')).to.equal('one')
    expect(fn.toString()).to.equal(
      '(start, end) => (start === "other" && end === "one") ? "one" : "other"'
    )
  })

  it('mixed start dependencies', () => {
    const data = {
      'pluralRange-start-few-end-few': 'few',
      'pluralRange-start-few-end-many': 'many',
      'pluralRange-start-few-end-other': 'other',
      'pluralRange-start-many-end-few': 'few',
      'pluralRange-start-many-end-many': 'many',
      'pluralRange-start-many-end-other': 'other',
      'pluralRange-start-one-end-few': 'few',
      'pluralRange-start-one-end-many': 'many',
      'pluralRange-start-one-end-other': 'other',
      'pluralRange-start-one-end-two': 'other',
      'pluralRange-start-other-end-few': 'few',
      'pluralRange-start-other-end-many': 'many',
      'pluralRange-start-other-end-one': 'other',
      'pluralRange-start-other-end-other': 'other',
      'pluralRange-start-other-end-two': 'other',
      'pluralRange-start-two-end-few': 'few',
      'pluralRange-start-two-end-many': 'many',
      'pluralRange-start-two-end-other': 'other',
      'pluralRange-start-zero-end-few': 'few',
      'pluralRange-start-zero-end-many': 'many',
      'pluralRange-start-zero-end-one': 'zero',
      'pluralRange-start-zero-end-other': 'other',
      'pluralRange-start-zero-end-two': 'zero'
    }
    const fn = compileRange(data)
    expect(fn()).to.equal('other')
    expect(fn('foo', 'bar')).to.equal('other')
    expect(fn('one', 'few')).to.equal('few')
    expect(fn('zero', 'one')).to.equal('zero')
    expect(fn.toString()).to.equal(`(start, end) => (
  end === "few" ? "few"
  : end === "many" ? "many"
  : (start === "zero" && end === "one") ? "zero"
  : (start === "zero" && end === "two") ? "zero"
  : "other"\n)`)
  })
})

describe('invalid plural ranges', () => {
  it('bad match', () => {
    expect(() => compileRange({ 'plurals-type-cardinal': 'other' })).to.throw(
      /does not match/
    )
  })

  it('bad start', () => {
    expect(() =>
      compileRange({ 'pluralRange-start-foo-end-other': 'other' })
    ).to.throw(/plural range key/)
  })

  it('bad end', () => {
    expect(() =>
      compileRange({ 'pluralRange-start-other-end-foo': 'other' })
    ).to.throw(/plural range key/)
  })

  it('bad result', () => {
    expect(() =>
      compileRange({ 'pluralRange-start-other-end-other': 'foo' })
    ).to.throw(/plural range result/)
  })
})

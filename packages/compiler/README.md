# make-plural-compiler

`make-plural-compiler` translates [Unicode CLDR] pluralization [rules] to JavaScript functions. A precompiled build of its output is published separately as the [make-plural] package.

[unicode cldr]: http://cldr.unicode.org/
[rules]: http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
[make-plural]: https://www.npmjs.com/package/make-plural

## Installation & Usage

```
npm install make-plural-compiler
```

```js
import Compiler from 'make-plural-compiler'
```

## Compiler.load(cldr, ...)

Loads CLDR rules from one or more `cldr` variables, each of which must be an object formatted like [this][json].

No plural data is included by default, so you'll need to call this at least once, or otherwise fill the `Compiler.rules` object.

The default CLDR rules are available from the [cldr-core] package, and may be loaded as seen in the examples below.

[json]: https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/plurals.json
[cldr-core]: https://www.npmjs.com/package/cldr-core

## new Compiler(lc, { cardinals, ordinals })

Returns a function that takes an argument `n` and returns its plural category for the given locale `lc`. If no direct match for `lc` is found, it is compared case-insensitively to known locales.

The returned function has an overloaded `toString(name)` method that may be used to generate a clean string representation of the function, with an optional name `name`.

The optional second parameter may contain the following boolean members:

- `cardinals` — if true, rules for cardinal values (1 day, 2 days, etc.) are included
- `ordinals` — if true, rules for ordinal values (1st, 2nd, etc.) are included

If both `cardinals` and `ordinals` are true, the returned function takes a second parameter `ord`. Then, if `ord` is true, the function will return the ordinal rather than cardinal category applicable to `n` in locale `lc`.

If the second parameter is undefined, the values are taken from `Compiler.cardinals` (default `true`) and `Compiler.ordinals` (default `false`).

```js
var plurals = require('cldr-core/supplemental/plurals.json')
var ordinals = require('cldr-core/supplemental/ordinals.json')
var Compiler = require('make-plural-compiler').load(plurals, ordinals)
// { [Function: MakePlural]
//   cardinals: true,
//   ordinals: false,
//   rules:
//    { cardinal:
//       { af: [Object],
//         ak: [Object],
//         am: [Object],
// snip 193 lines...
//         yo: [Object],
//         zh: [Object],
//         zu: [Object] },
//      ordinal:
//       { af: [Object],
//         am: [Object],
//         ar: [Object],
// snip 78 lines...
//         vi: [Object],
//         zh: [Object],
//         zu: [Object] } } }

var sk = new Compiler('sk') // Note: not including ordinals by default
// { [Function]
//   _obj:
//    { lc: 'sk',
//      cardinals: true,
//      ordinals: false,
//      categories: { cardinal: [Object], ordinal: [] },
//      parser: { v0: 1, i: 1 },
//      tests: { obj: [Circular], ordinal: {}, cardinal: [Object] },
//      fn: [Circular] },
//   categories: { cardinal: [ 'one', 'few', 'many', 'other' ], ordinal: [] },
//   test: [Function],
//   toString: [Function] }

sk(1)
// 'one'

sk(3.0)
// 'few'

sk('1.0')
// 'many'

sk('0')
// 'other'

console.log(sk.toString())
// function(n) {
//   var s = String(n).split('.'), i = s[0], v0 = !s[1];
//   return (i == 1 && v0 ) ? 'one'
//       : ((i >= 2 && i <= 4) && v0 ) ? 'few'
//       : (!v0   ) ? 'many'
//       : 'other';
// }
```

## Dependencies

This library has no explicit dependencies, but it will require CLDR plural rule data to be useful; the [LDML Language Plural Rules] as used in CLDR release 24 and later are supported.

The canonical source for the data is [cldr-core] (as shown above), but the compiler may also be used e.g. with [cldr-data]:

```js
var cldr = require('cldr-data')
var MakePlural = require('make-plural/lib/make-plural').load(
  cldr('supplemental/plurals'),
  cldr('supplemental/ordinals')
)
var en = new MakePlural('en')
en(3, true)
// 'few'
```

[ldml language plural rules]: http://unicode.org/reports/tr35/tr35-numbers.html#Language_Plural_Rules
[cldr-data]: https://www.npmjs.org/package/cldr-data

# make-plural-compiler

`make-plural-compiler` translates [Unicode CLDR] pluralization [rules] to JavaScript functions.
A precompiled build of its output is published separately as the [make-plural] package.

[unicode cldr]: http://cldr.unicode.org/
[rules]: http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
[make-plural]: https://www.npmjs.com/package/make-plural

## Installation & Usage

```
npm install make-plural-compiler
```

```js
import { Compiler, compileRange } from 'make-plural-compiler'
```

### `Compiler.load(cldr, ...)`

Loads CLDR rules from one or more `cldr` variables, each of which must be an object formatted like [this][json].

No plural data is included by default, so you'll need to call this at least once, or otherwise fill the `Compiler.rules` object.

The default CLDR rules are available from the [cldr-core] package, and may be loaded as seen in the examples below.

[json]: https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/plurals.json
[cldr-core]: https://www.npmjs.com/package/cldr-core

### `new Compiler(lc, { cardinals, ordinals })`

Creates a new compiler for the given locale `lc`.
If no direct match for `lc` is found, it is compared case-insensitively to known locales.

The optional second parameter may contain the following boolean members:

- `cardinals` — if true, rules for cardinal values (1 day, 2 days, etc.) are included
- `ordinals` — if true, rules for ordinal values (1st, 2nd, etc.) are included

If the second parameter is undefined, the values are taken from `Compiler.cardinals` (default `true`) and `Compiler.ordinals` (default `false`).

### `Compiler#compile()`

Returns a function that takes an argument `n` and returns its plural category for the given locale.
The function has an overloaded `toString(name)` method that may be used to generate a clean string representation of the function, with an optional name `name`.

If the compiler's `cardinals` and `ordinals` options are both true, the returned function takes a second parameter `ord`.
Then, if `ord` is true, the function will return the ordinal rather than cardinal category applicable to `n` in locale `lc`.

### `Compiler#test()`

Available after `compile()` has been called, `test()` verifies that all of the sample values included in the rules' samples are correctly categorised by teh compiled function.
Either throws an error or returns `undefined` on success.

```js
import plurals from 'cldr-core/supplemental/plurals.json'
import ordinals from 'cldr-core/supplemental/ordinals.json'
import { Compiler } from 'make-plural-compiler'

Compiler.load(plurals, ordinals)
// { [Function: Compiler]
//   cardinals: true,
//   ordinals: false,
//   foldWidth: 78,
//   rules:
//    { cardinal:
//       { af: [Object],
//         ak: [Object],
//         am: [Object],
//         [snip many lines...]
//         yue: [Object],
//         zh: [Object],
//         zu: [Object] },
//      ordinal:
//       { af: [Object],
//         am: [Object],
//         ar: [Object],
//         [snip slightly fewer lines...]
//         yue: [Object],
//         zh: [Object],
//         zu: [Object] } } }

var skc = new Compiler('sk') // Note: not including ordinals by default
// Compiler {
//   lc: 'sk',
//   categories: { cardinal: [], ordinal: [] },
//   parser: Parser {},
//   tests: Tests { lc: 'sk', ordinal: {}, cardinal: {} },
//   types: { cardinals: true, ordinals: false } }

var sk = skc.compile()
// [Function: anonymous] { toString: [Function (anonymous)] }

skc.test()
// undefined

sk(1)
// 'one'

sk(3.0)
// 'few'

sk('1.0')
// 'many'

sk('0')
// 'other'

console.log(String(sk))
// (n) => {
//   const s = String(n).split('.'), i = s[0], v0 = !s[1];
//   return n == 1 && v0 ? 'one'
//     : (i >= 2 && i <= 4) && v0 ? 'few'
//     : !v0 ? 'many'
//     : 'other';
// }
```

### `compileRange(data)`

Compiles Unicode CLDR plural range data into a corresponding JavaScript function.
`data` should be an object with keys matching the regular expression `^pluralRange-start-(\w+)-end-(\w+)$`, and valid CLDR category identifiers as values.

Returns a function, which when given a `start` and an `end` category as arguments, determines the plural category of the entire range.

## Dependencies

This library has no explicit dependencies, but it will require CLDR plural rule data to be useful; the [LDML Language Plural Rules] as used in CLDR release 24 and later are supported.

The canonical source for the data is [cldr-core] (as shown above), but the compiler may also be used e.g. with [cldr-data]:

```js
const cldr = require('cldr-data')
const { Compiler } = require('make-plural-compiler')

Compiler.load(cldr('supplemental/plurals'), cldr('supplemental/ordinals'))
const enc = new Compiler('en')
const en = enc.compile()
en(3, true)
// 'few'
```

[ldml language plural rules]: http://unicode.org/reports/tr35/tr35-numbers.html#Language_Plural_Rules
[cldr-data]: https://www.npmjs.org/package/cldr-data

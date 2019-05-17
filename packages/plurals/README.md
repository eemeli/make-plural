# make-plural

`make-plural` provides JavaScript functions determining the pluralization categories of the approximately 200 languages included in the [Unicode CLDR].

The categorization functions are pre-compiled, require no runtime dependencies, and should compress to about 2.5kB. In order to generate an even smaller file from a subset of all possible language (or to drop ordinal plural support), use [make-plural-compiler].

[unicode cldr]: http://cldr.unicode.org/
[make-plural-compiler]: https://www.npmjs.com/package/make-plural-compiler

## Installation & Usage

```
npm install make-plural
```

The "main" export `umd/plurals.js` contains an UMD module that can be included with node's `require` or AMD's `define`. In a browser environment, it will populate a global object `plurals`. Said module contains approximately 200 functions (one per [language]), each taking as a first parameter the value to be classified (either a number or a string), and as an optional second parameter, a boolean that if true, applies ordinal rather than cardinal rules.

`umd/pluralCategories.js` has a similar structure to `umd/plurals.js`, but contains an array of the pluralization categories the cardinal and ordinal rules each language's pluralization function may output.

`es6/plurals.js` and `es6/pluralCategories.js` are the ES6 module equivalents of the above.

If your language isn't directly included in the plural rules, try removing any trailing parts that are separated from the stem by `-` or `_`. Note also that the [capitalization of locale codes] is lowercase for the language, but uppercase for the country, so for example the code for Portugese as spoken in Portugal is `pt-PT`.

[language]: http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
[capitalization of locale codes]: https://tools.ietf.org/html/bcp47#section-2.1.1

```js
var plurals = require('make-plural')
// { af: [Function],
//   ak: [Function],
//   am: [Function],
// snip 193 lines...
//   yo: [Function],
//   zh: [Function],
//   zu: [Function] }

plurals.en(1) // 1st param is the value
// 'one'

plurals.en(2)
// 'other'

plurals.en(2, true) // 2nd param, if true-ish, is for ordinal rules
// 'two'

console.log(plurals.en.toString())
// function (n, ord) {
//   var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
//       n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
//   if (ord) return (n10 == 1 && n100 != 11) ? 'one'
//       : (n10 == 2 && n100 != 12) ? 'two'
//       : (n10 == 3 && n100 != 13) ? 'few'
//       : 'other';
//   return (n == 1 && v0) ? 'one' : 'other';
// }

var pluralCategories = require('make-plural/umd/pluralCategories')
// { af: { cardinal: [ 'one', 'other' ], ordinal: [ 'other' ] },
//   ak: { cardinal: [ 'one', 'other' ], ordinal: [ 'other' ] },
//   am: { cardinal: [ 'one', 'other' ], ordinal: [ 'other' ] },
//   ar:
//    { cardinal: [ 'zero', 'one', 'two', 'few', 'many', 'other' ],
//      ordinal: [ 'other' ] },
// snip 255 lines...
//   zh: { cardinal: [ 'other' ], ordinal: [ 'other' ] },
//   zu: { cardinal: [ 'one', 'other' ], ordinal: [ 'other' ] } }
```

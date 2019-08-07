# make-plural

`make-plural` provides JavaScript functions determining the pluralization categories of the approximately 200 languages included in the [Unicode CLDR].

The categorization functions are pre-compiled, require no runtime dependencies, and should compress to about 2.5kB. In order to generate an even smaller file from a subset of all possible language (or to drop ordinal plural support), use [make-plural-compiler].

[unicode cldr]: http://cldr.unicode.org/
[make-plural-compiler]: https://www.npmjs.com/package/make-plural-compiler

## Installation & Usage

```
npm install make-plural
```

The "main" export provides approximately 200 functions (one per [language]), each taking as a first parameter the value to be classified (either a number or a string), and as an optional second parameter, a boolean that if true, applies ordinal rather than cardinal rules. In Webpack, Rollup, and other environments that support it, this will resolve to `plurals.mjs`, an ES6 module. Elsewhere, this will resolve to `plurals.js`, an UMD module.

`make-plural/pluralCategories` has a similar structure to the main export `make-plural/plurals`, but contains for each language an array of the pluralization categories the cardinal and ordinal rules that that language's pluralization function may output. It is also provided in `.mjs` and `.js` variants.

The pluralization functions are almost all named using the corresponding 2-3 character [language code]. Due to JavaScript identifier restrictions, there are two exceptions: the function for Portugese as spoken in Portugal (`pt-PT`; `pt` is Brazilian Portuguese) is available as `pt_PT()`, and the now-deprecated `in` subtag for Indonesian (preferred: `id`) is available as `_in()`. The exact `identifier()` transformation used for these names is available from [safe-identifier] package on npm.

[language]: http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
[language code]: https://www.unicode.org/cldr/charts/latest/supplemental/languages_and_scripts.html
[safe-identifier]: https://www.npmjs.com/package/safe-identifier

```js
import * as plurals from 'make-plural'
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

String(plurals.en)
// function en(n, ord) {
//   var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
//       n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
//   if (ord) return (n10 == 1 && n100 != 11) ? 'one'
//       : (n10 == 2 && n100 != 12) ? 'two'
//       : (n10 == 3 && n100 != 13) ? 'few'
//       : 'other';
//   return (n == 1 && v0) ? 'one' : 'other';
// }

import * as pluralCategories from 'make-plural/pluralCategories'
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

## Optimization and Tree Shaking

The package file paths and exports are structured in a manner that should allow transparent usage in any module system. In particular, when importing as an ES6 module, tree shaking should be able drop all but the explicitly used functions from the output, provided that named rather than wildcard imports are used:

```js
import { en, fi } from 'make-plural'
```

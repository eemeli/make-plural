[![ISC License](https://img.shields.io/npm/l/make-plural.svg)](http://en.wikipedia.org/wiki/ISC_license)
[![Build Status](https://travis-ci.org/eemeli/make-plural.js.svg?branch=master)](https://travis-ci.org/eemeli/make-plural.js)

make-plural
===========

Make-plural is a JavaScript module that translates
[Unicode CLDR](http://cldr.unicode.org/)
[pluralization rules](http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html)
to JavaScript functions. It includes both a live parser (`make-plural.js`) as
well as the generated output for the latest edition of the CLDR (`plurals.js`);
the latter is just over 2kB in size when minified & gzipped, and covers 199
languages, so it's probably what you want unless you really know what you're
doing.

Make-plural is written in
[ECMAScript 6](https://people.mozilla.org/~jorendorff/es6-draft.html) and
transpiled using [Babel](https://babeljs.io/) and
[Browserify](http://browserify.org/) to CommonJS and AMD and ES6 module formats,
as well as being suitable for use in browser environments.


## Installation

```
npm install make-plural
```
_or_
```
bower install make-plural
```
_or_
```
git clone https://github.com/eemeli/make-plural.js.git
cd make-plural.js
npm install
make all
```
_or_ download the latest release from
[here](https://github.com/eemeli/make-plural.js/releases/latest)


## `plurals.js` - Precompiled plurals

Contains an UMD module that can be included with node's `require` or AMD's
`define`. In a browser environment, will populate a global object `plurals`.
Said module contains 199 functions (one per
[language](http://www.unicode.org/cldr/charts/27/supplemental/language_plural_rules.html)),
each taking as a first parameter the value to be classified (either a number or
a string), and as an optional second parameter, a boolean that if true, applies
ordinal rather than cardinal rules.

If your language isn't directly included, try removing any trailing parts that
are separated from the stem by `-` or `_`.


### Precompiled use: Node

```js
> plurals = require('make-plural/plurals')
{ af: [Function],
  ak: [Function],
  am: [Function],
    // snip 193 lines...
  yo: [Function],
  zh: [Function],
  zu: [Function] }

> plurals.en(1)  // 1st param is the value
'one'

> plurals.en(2)
'other'

> plurals.en(2, true)  // 2nd param, if true-ish, is for ordinal rules
'two'

> console.log(plurals.en.toString())
function (n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return (n10 == 1 && n100 != 11) ? 'one'
      : (n10 == 2 && n100 != 12) ? 'two'
      : (n10 == 3 && n100 != 13) ? 'few'
      : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}
```

### Precompiled use: Web

```html
<script src="path/to/make-plural/plurals.min.js"></script>
<script>
  var ru = plurals.ru
  console.log('1: ' + plurals.ru(1) + ', 3.0: ' + plurals.ru(3.0) +
              ', "1.0": ' + plurals.ru('1.0') + ', "0": ' + plurals.ru('0'));
  console.log(plurals.ru.toString());
</script>
```
With outputs:
```
1: one, 3.0: few, "1.0": other, "0": many

function(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1),
      i100 = i.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1 && i100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12
          || i100 > 14)) ? 'few'
      : (v0 && i10 == 0 || v0 && (i10 >= 5 && i10 <= 9)
          || v0 && (i100 >= 11 && i100 <= 14)) ? 'many'
      : 'other';
}
```

Note that with `plurals.min.js`, the stringified function would be rendered as:
```js
function (e,t){var r=String(e).split("."),n=r[0],o=!r[1],c=n.slice(-1),
i=n.slice(-2);return t?"other":o&&1==c&&11!=i?"one":o&&c>=2&&4>=c&&(12>i||i>14)?
"few":o&&0==c||o&&c>=5&&9>=c||o&&i>=11&&14>=i?"many":"other"}
```


## `make-plural.js` - Live compiler

### new MakePlural(lc, opt)
Returns a function that takes an argument `n` and returns its plural category
for the given locale `lc`.

The returned function has an overloaded `toString(name)` method that may be
used to generate a clean string representation of the function, with an
optional name `name`.

The optional `opt` parameter may contain the following boolean members:
* `cardinals` — if true, rules for cardinal values (1 day, 2 days, etc.) are 
  included
* `ordinals` — if true, rules for ordinal values (1st, 2nd, etc.) are included

If both `opt.ordinals` and `opt.cardinals` are true, the returned function takes
a second parameter `ord`. Then, if `ord` is true, the function will return the
ordinal rather than cardinal category applicable to `n` in locale `lc`.

If `lc` or the `opt` values are not set, the values are taken from
`MakePlural.lc` (no default value), `MakePlural.cardinals` (default `true`) and
`MakePlural.ordinals` (default `false`).


### MakePlural.load(cldr, ...)
Loads CLDR rules from one or more `cldr` variables, each of which may be an
object or the path to a JSON file formatted like
[this](https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/plurals.json).
The stored rules are kept in `MakePlural.rules.cardinal` and
`MakePlural.rules.ordinal`, which may also be directly accessed.

If called within a context where `request()` isn't available and `cldr` is a
string, it's taken as the URL of the JSON file that'll be fetched and parsed
using a synchronous `XMLHttpRequest`.

By default, `MakePlural()` will call `MakePlural.load(cldr)` when required,
using the rules included in `data/`, `plurals.json` and `ordinals.json`.


### Live use: Node

```js
> MakePlural = require('make-plural/make-plural').load(
... require('./data/plurals.json'), require('./data/ordinals.json'))
{ [Function: MakePlural]
  cardinals: true,
  ordinals: false,
  rules: 
   { cardinal: 
      { af: [Object],
        ak: [Object],
        am: [Object],
        // snip 193 lines...
        yo: [Object],
        zh: [Object],
        zu: [Object] },
     ordinal: 
      { af: [Object],
        am: [Object],
        ar: [Object],
        // snip 78 lines...
        vi: [Object],
        zh: [Object],
        zu: [Object] } } }

> sk = new MakePlural('sk')  // Note: not including ordinals by default
{ [Function]
  obj: 
   { lc: 'sk',
     cardinals: true,
     ordinals: false,
     parser: { v0: 1, i: 1 },
     tests: { obj: [Circular], ordinal: {}, cardinal: [Object] },
     fn: [Circular] },
  test: [Function],
  toString: [Function] }

> sk(1)
'one'

> sk(3.0)
'few'

> sk('1.0')
'many'

> sk('0')
'other'

> console.log(sk.toString())
function(n) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1];
  return (i == 1 && v0 ) ? 'one'
      : ((i >= 2 && i <= 4) && v0 ) ? 'few'
      : (!v0   ) ? 'many'
      : 'other';
}
```

`make-plural.js` may also be used in browser environments; see `test/index.html`
for an example of its use.


## CLI Usage

```sh
$ ./bin/make-plural fr
function fr(n, ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
}

$ ./bin/make-plural fr 1.5
one

$ ./bin/make-plural fr 1.5 true
other
```

Please see the source of `src/index.js` for more details.



## Dependencies

Make-plural has no runtime dependencies. CLDR plural rule data is included in
JSON format; make-plural supports the
[LDML Language Plural Rules](http://unicode.org/reports/tr35/tr35-numbers.html#Language_Plural_Rules)
as used in CLDR release 24 and later.

Using `MakePlural.load()`, you may make use of external sources of CLDR data.
For example, the following works when using together with
[cldr-data](https://www.npmjs.org/package/cldr-data):
```js
> cldr = require('cldr-data');
> MakePlural = require('make-plural/make-plural').load(
    cldr('supplemental/plurals'),
    cldr('supplemental/ordinals')
  );
> en = new MakePlural('en');
> en(3, true)
'few'
```

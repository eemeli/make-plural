make-plural
===========

A JavaScript module that translates [Unicode CLDR](http://cldr.unicode.org/)
[pluralization rules](http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html)
to executable JavaScript.


## Installation

```
npm install make-plural
```


## Usage

```js
> plurals = require('make-plural')
{ set_rules: [Function], build: [Function] }

> console.log( plurals.build('fr') )
function(n) {
  if (n >= 0 && n < 2) return 'one';
  return 'other';
}

> console.log( plurals.build('sk') )
function(n) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1];
  if (n == 1 && v0) return 'one';
  if ((i >= 2 && i <= 4) && v0) return 'few';
  if (!v0) return 'many';
  return 'other';
}

> sk = plurals.build('sk', {'return_function':1})
[Function]

> sk(1)
'one'

> sk(3.0)
'few'

> sk('1.0')
'many'

> sk('0')
'other'
```


## Methods

### build(lc, opt)
By default, returns a string representation of a function that takes a single
argument `n` and returns its plural category for the given locale `lc`. The
optional `opt` object may contain the following members, each of which is
assumed as false by default:
* `minify` — if true, the string output of `build` is minified
* `no_tests` — if true, the generated function is not verified by testing it
  with each of the example values included in the CLDR rules
* `quiet` — if true, no output is reported to `console.error` on error
* `return_function` — if true, `build` returns an executable function of `n`
  rather than a string

### set_rules(cldr)
Sets the used CLDR rules to `cldr`, which may be an object or the path to a JSON
file formatted like [this](http://www.unicode.org/repos/cldr-aux/json/25/supplemental/plurals.json).
By default, the included rules in `data/unicode-cldr-plural-rules.json` are
used.


## Dependencies

None. CLDR plural rule data is included in JSON format; make-plural supports the
[LDML Language Plural Rules](http://unicode.org/reports/tr35/tr35-numbers.html#Language_Plural_Rules)
as used in CLDR release 24 and later.

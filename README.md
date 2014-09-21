make-plural.js
==============

A JavaScript module that translates [Unicode CLDR] [pluralization rules] to
executable JavaScript.

[Unicode CLDR]: http://cldr.unicode.org/
[pluralization rules]: http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html


## Installation

Using npm:
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

> sk = plurals.build('sk', true)
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

### build(lc, op_function)
By default, returns a string representation of a function that takes a single
argument `n` and returns its plural category for the given locale `lc`. If
`op_function` is `true`, it returns an executable function instead.

### set_rules(cldr)
Sets the used CLDR rules to `cldr`, which may be an object or the path to a
JSON file formatted like [this](http://www.unicode.org/repos/cldr-aux/json/25/supplemental/plurals.json).
By default, the included rules in `data/unicode-cldr-plural-rules.json` are
used.


## Dependencies

None.

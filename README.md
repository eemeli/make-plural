make-plural
===========

A JavaScript module that translates [Unicode CLDR](http://cldr.unicode.org/)
[pluralization rules](http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html)
to JavaScript functions.

Can be used as a CommonJS or AMD module, or directly in a browser environment.


## Installation

```
npm install make-plural
```
or
```
git clone https://github.com/eemeli/make-plural.js.git
```

## Usage: Node

```js
> MakePlural = require('make-plural')
{ [Function] opt: {}, rules: {}, load: [Function] }

> sk = MakePlural('sk')
{ [Function] toString: [Function] }

> console.log(sk.toString())
function(n) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1];
  return (n == 1 && v0) ? 'one'
      : ((i >= 2 && i <= 4) && v0) ? 'few'
      : (!v0) ? 'many'
      : 'other';
}

> sk(1)
'one'

> sk(3.0)
'few'

> sk('1.0')
'many'

> sk('0')
'other'

> en = MakePlural('en', {ordinals:1})
{ [Function] toString: [Function] }

> console.log(en.toString())
function(n,ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
      n10 = t0 && s[0].substr(-1), n100 = t0 && s[0].substr(-2);
  if (ord) return (n10 == 1 && n100 != 11) ? 'one'
      : (n10 == 2 && n100 != 12) ? 'two'
      : (n10 == 3 && n100 != 13) ? 'few'
      : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}

> en(2)
'other'

> en(2, true)
'two'
```

## Usage: Web

```html
<script src="path/to/make-plural.js"></script>
<script>
  var ru = MakePlural('ru', {ordinals:1});
  console.log(ru.toString());
  console.log('1: ' + ru(1) + ', 3.0: ' + ru(3.0) +
              ', "1.0": ' + ru('1.0') + ', "0": ' + ru('0'));
</script>
```
With outputs:
```
function(n,ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.substr(-1),
      i100 = i.substr(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1 && i100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12
          || i100 > 14)) ? 'few'
      : (v0 && i10 == 0 || v0 && (i10 >= 5 && i10 <= 9)
          || v0 && (i100 >= 11 && i100 <= 14)) ? 'many'
      : 'other';
}

1: one, 3.0: few, "1.0": other, "0": many
```

If `request()` isn't available, the CLDR rules are fetched automatically when
required using synchronous `XMLHttpRequest` calls for the JSON files at the
default locations. If that doesn't work for you, you should call
`MakePlural.load(cldr)` before calling `MakePlural()`.


## Usage: CLI

```sh
$ ./bin/make-plural
Locales verified ok:
    af ak am ar asa ast az be bem bez bg bh bm bn bo br brx bs ca cgg chr ckb
    cs cy da de dsb dv dz ee el en eo es et eu fa ff fi fil fo fr fur fy ga
    gd gl gsw gu guw gv ha haw he hi hr hsb hu hy id ig ii in is it iu iw ja
    jbo jgo ji jmc jv jw ka kab kaj kcg kde kea kk kkj kl km kn ko ks ksb ksh
    ku kw ky lag lb lg lkt ln lo lt lv mas mg mgo mk ml mn mo mr ms mt my nah
    naq nb nd ne nl nn nnh no nqo nr nso ny nyn om or os pa pap pl prg ps pt
    pt-PT rm ro rof root ru rwk sah saq se seh ses sg sh shi si sk sl sma smi
    smj smn sms sn so sq sr ss ssy st sv sw syr ta te teo th ti tig tk tl tn
    to tr ts tzm ug uk ur uz ve vi vo vun wa wae wo xh xog yi yo zh zu

$ ./bin/make-plural fr
function fr(n,ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
}

$ ./bin/make-plural fr 1.5
one
```


## Methods

### MakePlural(lc, opt)
Returns a function that takes a single argument `n` and returns its plural
category for the given locale `lc`.

The returned function has an overloaded `toString(name)` method that may be
used to generate a clean string representation of the function, with an
optional name `name`.

The optional `opt` parameter may contain the following members, each of which is
assumed false by default:
* `no_cardinals` — if true, rules for cardinal values (1 day, 2 days, etc.)
   are not included
* `no_tests` — if true, the generated function is not verified by testing it
   with each of the example values included in the CLDR rules
* `ordinals` — if true, rules for ordinal values (1st, 2nd, etc.) are included
* `quiet` — if true, no output is reported to `console.error` on error

If `opt.ordinals` is true and `opt.no_cardinals` is not true, the returned
function takes a second parameter `ord`. Then, if `ord` is true, the function
will return the ordinal rather than cardinal category applicable to `n` in
locale `lc`.

If `opt` is not set, it takes the value of `MakePlural.opt`. If `lc` is not set,
it takes the value of `opt.lc`.

In a context where `module.exports` is not available but `exports` is, this
function is exported as `MakePlural.get()`.

### MakePlural.load(cldr, ...)
Loads CLDR rules from one or more `cldr` variables, each of which may be an
object or the path to a JSON file formatted like
[this](http://www.unicode.org/repos/cldr-aux/json/26/supplemental/plurals.json).
The stored rules are kept in `MakePlural.rules.cardinal` and
`MakePlural.rules.ordinal`, which may also be directly accessed.

If called within a context where `request()` isn't available and `cldr` is a
string, it's taken as the URL of the JSON file that'll be fetched and parsed
using a synchronous `XMLHttpRequest`.

By default, `MakePlural()` will call `MakePlural.load(cldr)` when required,
using the rules included in `data/`, `unicode-cldr-plural-rules.json` and
`unicode-cldr-ordinal-rules.json`.


## Dependencies

None. CLDR plural rule data is included in JSON format; make-plural supports the
[LDML Language Plural Rules](http://unicode.org/reports/tr35/tr35-numbers.html#Language_Plural_Rules)
as used in CLDR release 24 and later.

Using `MakePlural.load()`, you may make use of external sources of CLDR data.
For example, the following works when using together with
[cldr-data](https://www.npmjs.org/package/cldr-data):
```js
> cldr = require('cldr-data');
> MakePlural = require('make-plural').load(
    cldr('supplemental/plurals'),
    cldr('supplemental/ordinals')
  );
> MakePlural('ar')(3.14);
'other'
```

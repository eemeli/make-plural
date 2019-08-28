make-plural-cli
===============

Command-line interface for [make-plural-compiler], used to build the [make-plural] package of pluralization functions, using [Unicode CLDR] pluralization [rules]. This tool may be of interest to you if you wish to build your own smaller set of pluralization functions, and you're not able to drop unused functions by tree-shaking.

For more detailed documentation and additional options, use `make-plural --help`.

[make-plural-compiler]: https://www.npmjs.com/package/make-plural-compiler
[make-plural]: https://www.npmjs.com/package/make-plural
[Unicode CLDR]: http://cldr.unicode.org/
[rules]: http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html


```
npm install make-plural-cli
```

## Print Plural Category

```sh
make-plural --locale [lc] cardinal [value]
make-plural --locale [lc] ordinal [value]

make-plural --locale en cardinal # one, other
make-plural --locale en cardinal 1 # one
make-plural --locale en cardinal 2 # other

make-plural --locale en ordinal # one, two, few, other
make-plural --locale en ordinal 1 # one
make-plural --locale en ordinal 2 # two
```

## Print JS Module

```
make-plural plurals [locale...]
make-plural categories [locale...]

make-plural plurals en fi > plurals.js
make-plural categories en fi > categories.js
```

```js
// plurals.js
export function en(n, ord) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return (n10 == 1 && n100 != 11) ? 'one'
      : (n10 == 2 && n100 != 12) ? 'two'
      : (n10 == 3 && n100 != 13) ? 'few'
      : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}
export function fi(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}
```

```js
// categories.js
const z = "zero", o = "one", t = "two", f = "few", m = "many", x = "other";

export const en = {cardinal:[o,x],ordinal:[o,t,f,x]};
export const fi = {cardinal:[o,x],ordinal:[x]};
```

make-plural-cli
===============

Command-line interface for [make-plural-compiler], used to build the [make-plural] package of pluralization functions, using [Unicode CLDR] pluralization [rules].

[make-plural-compiler]: https://www.npmjs.com/package/make-plural-compiler
[make-plural]: https://www.npmjs.com/package/make-plural
[Unicode CLDR]: http://cldr.unicode.org/
[rules]: http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html


## Installation & Usage

```sh
npm install make-plural-cli

npx make-plural > plurals.js

npx make-plural fr
# function fr(n, ord) {
#   if (ord) return (n == 1) ? 'one' : 'other';
#   return (n >= 0 && n < 2) ? 'one' : 'other';
# }

npx make-plural --locale fr --value 1.5
# one

npx make-plural 1.5 -l fr --ordinal
# other
```

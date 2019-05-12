[![ISC License](https://img.shields.io/npm/l/make-plural.svg)](http://en.wikipedia.org/wiki/ISC_license)
[![Build Status](https://travis-ci.org/eemeli/make-plural.svg?branch=master)](https://travis-ci.org/eemeli/make-plural)

# Make-plural Monorepo

This is a monorepo providing the following npm packages:

- [**`make-plural-compiler`**](packages/compiler) - Translates [Unicode CLDR] pluralization [rules] to executable JavaScript
- [**`make-plural-cli`**](packages/cli) - Command-line interface for the compiler
- [**`make-plural`**](packages/plurals) - Precompiled Unicode CLDR pluralization rules as JavaScript functions

[unicode cldr]: http://cldr.unicode.org/
[rules]: http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html

## Developing

```
git clone https://github.com/eemeli/make-plural.git
cd make-plural
npm install
npx lerna bootstrap
npm run build
```

Note that with the v5 release, the compiler and CLI were split from the canonical `make-plural` package, and the project is now managed with [Lerna](https://lerna.js.org/).

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.1](https://github.com/eemeli/make-plural/compare/make-plural-cli@6.0.0...make-plural-cli@6.0.1) (2019-10-18)


### Bug Fixes

* Include __esModule: true in CommonJS export (eemeli/intl-pluralrules[#12](https://github.com/eemeli/make-plural/issues/12)) ([70daa3d](https://github.com/eemeli/make-plural/commit/70daa3df0d985b2d4b4fd9d6cf8659a5f58a79f4))





# [6.0.0](https://github.com/eemeli/make-plural/compare/make-plural-cli@6.0.0-beta.3...make-plural-cli@6.0.0) (2019-10-17)


### BREAKING CHANGES

* This changes the syntax of the CLI options, now requiring a secondary command to select the output type.
* This drops the default export of the ES6 module, and for the UMD module renames "pt-PT" as pt_PT & "in" as _in.


### Features

* Add locale option to module prints ([7f4f480](https://github.com/eemeli/make-plural/commit/7f4f480))
* Add max-repeat option to customise common functions & categories ([e47a725](https://github.com/eemeli/make-plural/commit/e47a725))
* Automate common-categories detection ([3421285](https://github.com/eemeli/make-plural/commit/3421285))
* Automate common-plurals detection ([a6838a1](https://github.com/eemeli/make-plural/commit/a6838a1))
* Harmonise ES6 & UMD exports ([c24b666](https://github.com/eemeli/make-plural/commit/c24b666))
* Improve category printing, including vars for strings ([9c0a8d8](https://github.com/eemeli/make-plural/commit/9c0a8d8))
* Switch from minimist to yargs commands ([0680298](https://github.com/eemeli/make-plural/commit/0680298))
* Account for aliased locale codes ([f538772](https://github.com/eemeli/make-plural/commit/f538772))
* Add named exports to ES6 modules, for tree-shaking ([37021e6](https://github.com/eemeli/make-plural/commit/37021e6))
* Update cldr-core from 34 to 36 ([a9d2547](https://github.com/eemeli/make-plural/commit/a9d25474efde9b415dd5e4e63b825bcad06f7b07))


### Bug Fixes

* Refactor cli.js, splitting out print-categories, print-plurals & print-umd ([76f1941](https://github.com/eemeli/make-plural/commit/76f1941))
* Refactor common.js as common-plurals.js ([d14b3d4](https://github.com/eemeli/make-plural/commit/d14b3d4))
* Split & refactor get-compiler.js from cli.js ([1ccc8db](https://github.com/eemeli/make-plural/commit/1ccc8db))
* Stop mixing import & require() ([ec8028b](https://github.com/eemeli/make-plural/commit/ec8028b))
* Wrap runtime code in main() ([02d2110](https://github.com/eemeli/make-plural/commit/02d2110))
* Use proper full locale list for --no-cardinals ([c8a1cff](https://github.com/eemeli/make-plural/commit/c8a1cff))
* Update dependencies ([9991e86](https://github.com/eemeli/make-plural/commit/9991e86508db08088ef0975ce08c354610b7a4a9))



# [5.0.0](https://github.com/eemeli/make-plural/compare/9cbae0d...make-plural-cli@5.0.0) (2019-07-15)

### BREAKING CHANGES

* Split `make-plural-cli` into its own package
* Move the CLI binary here from `make-plural`


### Features

* Add --width to CLI, use slightly longer lines in published plurals ([19dad34](https://github.com/eemeli/make-plural/commit/19dad34))
* Include hashbang line directly in src/cli.js ([7f2b5d1](https://github.com/eemeli/make-plural/commit/7f2b5d1))
* Refactor references to common plurals/categories when printing module ([ecb5bf9](https://github.com/eemeli/make-plural/commit/ecb5bf9))
* Use non-anonymous functions in module export ([5316a1a](https://github.com/eemeli/make-plural/commit/5316a1a))


### Bug Fixes

* Refactor module printing internals ([cac8cbf](https://github.com/eemeli/make-plural/commit/cac8cbf))
* Switch from console.log to a custom wrapper for process.stdout.write ([f24d312](https://github.com/eemeli/make-plural/commit/f24d312))
* Use property() from safe-identifier to quote appropriately ([6499ba5](https://github.com/eemeli/make-plural/commit/6499ba5))
* Use source`` from common-tags for easier-to-read code ([a3ec74f](https://github.com/eemeli/make-plural/commit/a3ec74f))

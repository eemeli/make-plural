# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [6.0.0-beta.1](https://github.com/eemeli/make-plural/compare/make-plural-cli@5.0.0...make-plural-cli@6.0.0-beta.1) (2019-08-28)


### Bug Fixes

* **cli:** Refactor cli.js, splitting out print-categories, print-plurals & print-umd ([76f1941](https://github.com/eemeli/make-plural/commit/76f1941))
* **cli:** Refactor common.js as common-plurals.js ([d14b3d4](https://github.com/eemeli/make-plural/commit/d14b3d4))
* **cli:** Split & refactor get-compiler.js from cli.js ([1ccc8db](https://github.com/eemeli/make-plural/commit/1ccc8db))
* **cli:** Stop mixing import & require() ([ec8028b](https://github.com/eemeli/make-plural/commit/ec8028b))
* **cli:** Wrap runtime code in main() ([02d2110](https://github.com/eemeli/make-plural/commit/02d2110))


### Features

* **cli:** Add locale option to module prints ([7f4f480](https://github.com/eemeli/make-plural/commit/7f4f480))
* **cli:** Add max-repeat option to customise common functions & categories ([e47a725](https://github.com/eemeli/make-plural/commit/e47a725))
* **cli:** Automate common-categories detection ([3421285](https://github.com/eemeli/make-plural/commit/3421285))
* **cli:** Automate common-plurals detection ([a6838a1](https://github.com/eemeli/make-plural/commit/a6838a1))
* **cli:** Harmonise ES6 & UMD exports ([c24b666](https://github.com/eemeli/make-plural/commit/c24b666))
* **cli:** Improve category printing, including vars for strings ([9c0a8d8](https://github.com/eemeli/make-plural/commit/9c0a8d8))
* **cli:** Switch from minimist to yargs commands ([0680298](https://github.com/eemeli/make-plural/commit/0680298))
* Account for aliased locale codes ([f538772](https://github.com/eemeli/make-plural/commit/f538772))
* Add named exports to ES6 modules, for tree-shaking ([37021e6](https://github.com/eemeli/make-plural/commit/37021e6))


### BREAKING CHANGES

* **cli:** This changes the syntax of the CLI options, now
requiring a secondary command to select the output type.
* **cli:** This drops the default export of the ES6 module, and
for the UMD module renames "pt-PT" as pt_PT & "in" as _in.





# [5.0.0](https://github.com/eemeli/make-plural/compare/9cbae0d...make-plural-cli@5.0.0) (2019-07-15)

### BREAKING CHANGES

* Split `make-plural-cli` into its own package
* Move the CLI binary here from `make-plural`


### Features

* Add --width to CLI, use slightly longer lines in published plurals ([19dad34](https://github.com/eemeli/make-plural/commit/19dad34))
* Include hashbang line directly in src/cli.js ([7f2b5d1](https://github.com/eemeli/make-plural/commit/7f2b5d1))
* **cli:** Refactor references to common plurals/categories when printing module ([ecb5bf9](https://github.com/eemeli/make-plural/commit/ecb5bf9))
* **cli:** Use non-anonymous functions in module export ([5316a1a](https://github.com/eemeli/make-plural/commit/5316a1a))


### Bug Fixes

* **cli:** Refactor module printing internals ([cac8cbf](https://github.com/eemeli/make-plural/commit/cac8cbf))
* **cli:** Switch from console.log to a custom wrapper for process.stdout.write ([f24d312](https://github.com/eemeli/make-plural/commit/f24d312))
* **cli:** Use property() from safe-identifier to quote appropriately ([6499ba5](https://github.com/eemeli/make-plural/commit/6499ba5))
* **cli:** Use source`` from common-tags for easier-to-read code ([a3ec74f](https://github.com/eemeli/make-plural/commit/a3ec74f))

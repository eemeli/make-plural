# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.0](https://github.com/eemeli/make-plural/compare/5.1.0...6.0.0) (2021-08-27)

### ⚠ Breaking Changes

* Users of `make-plural-compiler` will need to apply the
  following change to their code:

      -import Compiler from 'make-plural-compiler'
      +import { Compiler } from 'make-plural-compiler'
* While using ES6 syntax for functions does not change
  their behaviour in any way, it will need to be transpiled if the target
  environment (e.g. IE 11) does not support it.

### Features

* Use const and => notation for function stringification ([b9da90a](https://github.com/eemeli/make-plural/commit/b9da90acd501b86a6b2ab1e73876ea05c57ebc74))
* Add plural range support ([cf77a71](https://github.com/eemeli/make-plural/commit/cf77a715c65f4282e95a5b332f9261eff0c234f0))
* export { Compiler } rather than default ([0cbbf58](https://github.com/eemeli/make-plural/commit/0cbbf58240208273f8350e5d9d162787a6eba49f))
* Export compileRange ([ab9c32a](https://github.com/eemeli/make-plural/commit/ab9c32a6c1b6c34404714cb7b45114c6310a5d65))
* Support c & e operands by ignoring them ([#22](https://github.com/eemeli/make-plural/issues/22)) ([8c6a553](https://github.com/eemeli/make-plural/commit/8c6a553c9c347301df5be24302836bcd20452038))
* Add Compiler.parseExamples() & refactor compiler.tests into compiler.examples ([655d27f](https://github.com/eemeli/make-plural/commit/655d27f6ef194e06d12476cd30e4a7b2a98b0a6f))

# [5.1.0](https://github.com/eemeli/make-plural/compare/make-plural-compiler@5.0.0...make-plural-compiler@5.1.0) (2020-03-08)


### Features

* **compiler:** Drop line folding & unnecessary (wrapping) ([c5d31f6](https://github.com/eemeli/make-plural/commit/c5d31f69d6f1032e291cb911cae8cc34b20099ed))





# [5.0.0](https://github.com/eemeli/make-plural/compare/9cbae0d...make-plural-compiler@5.0.0) (2019-07-15)

### BREAKING CHANGES

* Split `make-plural-compiler` into its own package
* Move the `make-plural/make-plural` endpoint to `make-plural-compiler`
* Refactor compiler API ([bba0839](https://github.com/eemeli/make-plural/commit/bba0839))
* Repackage as monorepo, using Lerna ([671781d](https://github.com/eemeli/make-plural/commit/671781d))
* Drop Bower support ([08f6668](https://github.com/eemeli/make-plural/commit/08f6668))


### Features

* Drop copying data from cldr-core; for now adds it to dependencies ([19339ff](https://github.com/eemeli/make-plural/commit/19339ff))
* Drop browserified & minified builds ([f7bb0dd](https://github.com/eemeli/make-plural/commit/f7bb0dd))
* Split compiler sources into three: parser, tests, compiler ([e796483](https://github.com/eemeli/make-plural/commit/e796483))
* Add Compiler.foldWidth as parameter ([9e0ea86](https://github.com/eemeli/make-plural/commit/9e0ea86))
* Fix function stringifier whitespace ([e1f58e7](https://github.com/eemeli/make-plural/commit/e1f58e7))
* add space regex in preparation for cldr@35 ([446c3d1](https://github.com/eemeli/make-plural/commit/446c3d1))


### Bug Fixes

* **compiler:** Fix function toString cleanup for Node 8 ([55c7f64](https://github.com/eemeli/make-plural/commit/55c7f64))

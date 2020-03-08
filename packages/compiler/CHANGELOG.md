# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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

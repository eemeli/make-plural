# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.0.0](https://github.com/eemeli/make-plural/compare/9cbae0d...make-plural@5.0.0) (2019-07-15)


### BREAKING CHANGES

* Split `make-plural-compiler` and `make-plural-cli` into their own packages
* Move the `make-plural/make-plural` endpoint to `make-plural-compiler`
* Move the `make-plural` binary to `make-plural-cli`
* Repackage as monorepo, using Lerna ([671781d](https://github.com/eemeli/make-plural/commit/671781d))
* Drop Bower support ([08f6668](https://github.com/eemeli/make-plural/commit/08f6668))


### Features

* Include compiled plurals & plural categories in git repo ([eeca17a](https://github.com/eemeli/make-plural/commit/eeca17a))
* **cli:** Refactor references to common plurals/categories when printing module ([ecb5bf9](https://github.com/eemeli/make-plural/commit/ecb5bf9))
* **cli:** Use non-anonymous functions in module export ([5316a1a](https://github.com/eemeli/make-plural/commit/5316a1a))

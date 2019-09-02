# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [6.0.0-beta.2](https://github.com/eemeli/make-plural/compare/make-plural@6.0.0-beta.1...make-plural@6.0.0-beta.2) (2019-09-02)


### Features

* **plurals:** Include separate exports for cardinals & ordinals ([ea23050](https://github.com/eemeli/make-plural/commit/ea23050))





# [6.0.0-beta.1](https://github.com/eemeli/make-plural/compare/make-plural@5.0.0...make-plural@6.0.0-beta.1) (2019-08-28)


### Bug Fixes

* **plurals:** Update for CLI changes ([9d151d0](https://github.com/eemeli/make-plural/commit/9d151d0))


### Features

* **cli:** Automate common-categories detection ([3421285](https://github.com/eemeli/make-plural/commit/3421285))
* **cli:** Automate common-plurals detection ([a6838a1](https://github.com/eemeli/make-plural/commit/a6838a1))
* **cli:** Improve category printing, including vars for strings ([9c0a8d8](https://github.com/eemeli/make-plural/commit/9c0a8d8))
* Account for aliased locale codes ([f538772](https://github.com/eemeli/make-plural/commit/f538772))
* **cli:** Harmonise ES6 & UMD exports ([c24b666](https://github.com/eemeli/make-plural/commit/c24b666))
* **plurals:** Change output paths ([3b4c7e9](https://github.com/eemeli/make-plural/commit/3b4c7e9))
* Add named exports to ES6 modules, for tree-shaking ([37021e6](https://github.com/eemeli/make-plural/commit/37021e6))


### BREAKING CHANGES

* **cli:** This drops the default export of the ES6 module, and
for the UMD module renames "pt-PT" as pt_PT & "in" as _in.
* **plurals:** This drops the umd/ and es6/ directories, in favour of
serving the plurals and pluralCategories files from the package root.
They are now distinguished by extension: .mjs for ES6 modules, and .js
for UMD packaging.





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

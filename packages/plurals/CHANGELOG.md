# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.2.2](https://github.com/eemeli/make-plural/compare/make-plural@6.2.1...make-plural@6.2.2) (2020-08-09)


### Bug Fixes

* **exports:** Add package.json to exports (fixes [#15](https://github.com/eemeli/make-plural/issues/15)) ([f77b2a5](https://github.com/eemeli/make-plural/commit/f77b2a5864cd0ce8500d72cb0ad94c30510d9f25))





## [6.2.1](https://github.com/eemeli/make-plural/compare/make-plural@6.2.0...make-plural@6.2.1) (2020-04-05)


### Bug Fixes

* **exports:** Add missing type, exports & browser config to package.json ([d2f3fa3](https://github.com/eemeli/make-plural/commit/d2f3fa30e11397f15dc68016f4ed45d45b11fe42))





# [6.2.0](https://github.com/eemeli/make-plural/compare/make-plural@6.1.0...make-plural@6.2.0) (2020-04-05)


### Features

* Add d.ts typings for pluralCategories ([ae7472e](https://github.com/eemeli/make-plural/commit/ae7472eb12ecdb9768197faddf0be409eb2ced55))
* Add d.ts typings for plurals ([db6e4b5](https://github.com/eemeli/make-plural/commit/db6e4b5d39994d159695ac113bdc5e005921a2f7))
* Include type PluralCategory in all d.ts files ([9b368fc](https://github.com/eemeli/make-plural/commit/9b368fc5adafb6dc95c4bf7973a494edcab9a9f8))





# [6.1.0](https://github.com/eemeli/make-plural/compare/make-plural@6.0.1...make-plural@6.1.0) (2020-03-08)


### Bug Fixes

* Always set __esModule in UMD builds (eemeli/intl-pluralrules[#15](https://github.com/eemeli/make-plural/issues/15)) ([57d90bc](https://github.com/eemeli/make-plural/commit/57d90bcab45ad6439509a144aaeb493e5e0ef7dd))


### Features

* **compiler:** Drop line folding & unnecessary (wrapping) ([c5d31f6](https://github.com/eemeli/make-plural/commit/c5d31f69d6f1032e291cb911cae8cc34b20099ed))





## [6.0.1](https://github.com/eemeli/make-plural/compare/make-plural@6.0.0...make-plural@6.0.1) (2019-10-18)


### Bug Fixes

* Include __esModule: true in CommonJS export (eemeli/intl-pluralrules[#12](https://github.com/eemeli/make-plural/issues/12)) ([70daa3d](https://github.com/eemeli/make-plural/commit/70daa3df0d985b2d4b4fd9d6cf8659a5f58a79f4))





# [6.0.0](https://github.com/eemeli/make-plural/compare/make-plural@6.0.0-beta.3...make-plural@6.0.0) (2019-10-17)


### BREAKING CHANGES

* This drops the default export of the ES6 module, and for the UMD module renames "pt-PT" as pt_PT & "in" as _in.
* This drops the umd/ and es6/ directories, in favour of serving the plurals and pluralCategories files from the package root. They are now distinguished by extension: .mjs for ES6 modules, and .js for UMD packaging.


### Features

* Automate common-categories detection ([3421285](https://github.com/eemeli/make-plural/commit/3421285))
* Automate common-plurals detection ([a6838a1](https://github.com/eemeli/make-plural/commit/a6838a1))
* Improve category printing, including vars for strings ([9c0a8d8](https://github.com/eemeli/make-plural/commit/9c0a8d8))
* Account for aliased locale codes ([f538772](https://github.com/eemeli/make-plural/commit/f538772))
* Harmonise ES6 & UMD exports ([c24b666](https://github.com/eemeli/make-plural/commit/c24b666))
* Change output paths ([3b4c7e9](https://github.com/eemeli/make-plural/commit/3b4c7e9))
* Add named exports to ES6 modules, for tree-shaking ([37021e6](https://github.com/eemeli/make-plural/commit/37021e6))
* Include separate exports for cardinals & ordinals ([ea23050](https://github.com/eemeli/make-plural/commit/ea23050))
* Update cldr-core from 34 to 36 ([a9d2547](https://github.com/eemeli/make-plural/commit/a9d25474efde9b415dd5e4e63b825bcad06f7b07))


### Bug Fixes

* Update for CLI changes ([9d151d0](https://github.com/eemeli/make-plural/commit/9d151d0))
* Oops, add missing files to release ([d4f3050](https://github.com/eemeli/make-plural/commit/d4f3050))



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

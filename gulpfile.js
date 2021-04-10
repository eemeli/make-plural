const { writeFile } = require('fs/promises')
const { dest, series, src } = require('gulp')
const babel = require('gulp-babel')
const { resolve } = require('path')
const { promisify } = require('util')

const execFile = promisify(require('child_process').execFile)

const compiler = () =>
  src('packages/compiler/src/*')
    .pipe(babel())
    .pipe(dest('packages/compiler/lib/'))

const cli = () =>
  src('packages/cli/src/*').pipe(babel()).pipe(dest('packages/cli/lib/'))

const makePluralCmd = resolve('packages/cli/make-plural')
const pluralDest = resolve('packages/plurals')
async function plurals(cb) {
  for (const [tgt, tgtOpt] of Object.entries({
    cardinals: ['plurals', '--no-ordinals'],
    ordinals: ['plurals', '--no-cardinals'],
    plurals: ['plurals'],
    pluralCategories: ['categories'],
    ranges: ['ranges', '--max-repeat=3']
  })) {
    for (const [ext, extOpt] of Object.entries({
      'd.ts': ['--dts'],
      js: ['--umd'],
      mjs: []
    })) {
      const { stdout } = await execFile(makePluralCmd, [...tgtOpt, ...extOpt])
      await writeFile(resolve(pluralDest, `${tgt}.${ext}`), stdout)
    }
  }
}

exports.default = series(compiler, cli, plurals)

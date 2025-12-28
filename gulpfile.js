const { dest, series, src } = require('gulp')
const babel = require('gulp-babel')
const { resolve } = require('path')
const { promisify } = require('util')

const execFile = promisify(require('child_process').execFile)
const writeFile = promisify(require('fs').writeFile)

const compiler = () =>
  src('packages/compiler/src/*.js')
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
    examples: ['examples'],
    ranges: ['ranges', '--max-repeat=3']
  })) {
    for (const [ext, extOpt] of Object.entries({
      'd.ts': ['--dts'],
      js: []
    })) {
      const { stdout } = await execFile(makePluralCmd, [...tgtOpt, ...extOpt])
      await writeFile(resolve(pluralDest, `${tgt}.${ext}`), stdout)
    }
  }
  const { stdout } = await execFile(makePluralCmd, ['examples', '--json'])
  await writeFile(resolve(pluralDest, 'examples.json'), stdout)
}

exports.default = series(compiler, cli, plurals)

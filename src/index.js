/** A compiler for make-plural.js
 *
 *  Usage:
 *    ./bin/make-plural                 // checks all locale rules
 *    ./bin/make-plural [lc]            // prints the locale function for LC
 *    ./bin/make-plural [lc] [n] [ord]  // prints the (ORD ? ordinal : plural) category for N in locale LC
 */

var argv = require('minimist')(process.argv.slice(2), {
        default: { locale: null, value: null, ordinal: null, cardinal: null, categories: false },
        alias: { locale: 'l', value: 'v', ordinal: 'o', cardinal: 'c' },
        string: [ 'locale', 'value' ],
        boolean: [ 'categories' ]
    }),
    MakePlural = require('../make-plural').load(
        require('../data/plurals.json'),
        require('../data/ordinals.json')
    );

const commonPlurals = [

`function(n, ord) {
  if (ord) return 'other';
  return 'other';
}`,

`function(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
}`,

`function(n, ord) {
  if (ord) return 'other';
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
}`,

`function(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}`

];

const commonCategories = [
    '{cardinal:["other"],ordinal:["other"]}',
    '{cardinal:["one","other"],ordinal:["other"]}',
    '{cardinal:["one","other"],ordinal:["one","other"]}',
    '{cardinal:["one","two","other"],ordinal:["other"]}'
];


// UMD pattern adapted from https://github.com/umdjs/umd/blob/master/returnExports.js
function umd(global, value) {
    return `
(function (root, ${global}) {
  if (typeof define === 'function' && define.amd) {
    define(${global});
  } else if (typeof exports === 'object') {
    module.exports = ${global};
  } else {
    root.${global} = ${global};
  }
}(this, {
${value}
}));`
}


function mapForEachLanguage(cb, opt) {
    const style = opt && !opt.cardinals ? 'ordinal' : 'cardinal';
    let languages = [];
    for (let lc in MakePlural.rules[style]) {
        const key = /^[A-Z_$][0-9A-Z_$]*$/i.test(lc) ? lc : JSON.stringify(lc),
              mp = new MakePlural(lc, opt).test();
        languages.push(key + ': ' + cb(mp));
    }
    return languages;
}

function printPluralsModule() {
    const plurals = mapForEachLanguage(mp => {
        let fn = mp.toString();
        commonPlurals.forEach(function(p, i) { if (fn === p) fn = `_cp[${i}]`; });
        return fn;
    });
    console.log('var _cp = [\n' + commonPlurals.join(',\n') + '\n];')
    console.log(umd('plurals', plurals.join(',\n\n')));
}

function printCategoriesModule() {
    const categories = mapForEachLanguage(mp => {
        let cat = JSON.stringify(mp.categories).replace(/"(\w+)":/g, '$1:');
        commonCategories.forEach(function(c, i) { if (cat === c) cat = `_cc[${i}]`; });
        return cat;
    });
    console.log('var _cc = [\n  ' + commonCategories.join(',\n  ') + '\n];')
    console.log(umd('pluralCategories', categories.join(',\n')));
}


function truthy(v) {
    if (v === '0' || v === 'false') return false;
    return !!v;
}

argv._.forEach(a => {
    if (argv.locale === null) argv.locale = a;
    else if (argv.value === null) argv.value = a;
    else if (argv.ordinal === null) argv.ordinal = a;
});

MakePlural.cardinals = (argv.cardinal !== null) ? truthy(argv.cardinal) : true;
MakePlural.ordinals = (argv.ordinal !== null) ? truthy(argv.ordinal) : true;

if (argv.locale) {
    const mp = new MakePlural(argv.locale).test();
    if (argv.categories) {
        const cats = mp.categories.cardinal
                         .concat(mp.categories.ordinal)
                         .filter((v, i, self) => self.indexOf(v) === i);
        console.log(cats.join(', '));
    } else if (argv.value !== null) {
        console.log(mp(argv.value, truthy(argv.ordinal)));
    } else {
        console.log(mp.toString(argv.locale));
    }
} else {
    if (argv.categories) {
        printCategoriesModule();
    } else {
        printPluralsModule();
    }
}

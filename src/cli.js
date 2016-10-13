/** A compiler for make-plural.js
 *
 *  Usage:
 *    ./bin/make-plural                 // checks all locale rules
 *    ./bin/make-plural [lc]            // prints the locale function for LC
 *    ./bin/make-plural [lc] [n] [ord]  // prints the (ORD ? ordinal : plural) category for N in locale LC
 */

var argv = require('minimist')(process.argv.slice(2), {
        default: { locale: null, value: null, ordinal: null, cardinal: null, categories: false, es6: false },
        alias: { locale: 'l', value: 'v', ordinal: 'o', cardinal: 'c', es6: 'e' },
        string: [ 'locale', 'value' ],
        boolean: [ 'categories', 'es6' ]
    });
var MakePlural = require('../make-plural').load(
        require('../data/plurals.json'),
        require('../data/ordinals.json')
    );

import * as common from './common';

const es6module = (value) => `
export default {
${value}
}`;

// UMD pattern adapted from https://github.com/umdjs/umd/blob/master/returnExports.js
const umd = (global, value) => `
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
}));`;


function mapForEachLanguage(cb, opt) {
    const style = opt && !opt.cardinals ? 'ordinal' : 'cardinal';
    let languages = [];
    for (let lc in MakePlural.rules[style]) {
        const key = /^[A-Z_$][0-9A-Z_$]*$/i.test(lc) && (lc !== 'in') ? lc : JSON.stringify(lc);
        const mp = new MakePlural(lc, opt).test();
        languages.push(key + ': ' + cb(mp));
    }
    return languages;
}

function printPluralsModule(es6) {
    const cp = common[MakePlural.ordinals ? 'combined' : 'cardinals'].plurals;
    const plurals = mapForEachLanguage(mp => {
        let fn = mp.toString();
        cp.forEach(function(p, i) { if (fn === p) fn = `_cp[${i}]`; });
        return fn;
    });
    if (es6) {
        console.log('const _cp = [\n' + cp.join(',\n') + '\n];');
        console.log(es6module(plurals.join(',\n\n')));
    } else {
        console.log('var _cp = [\n' + cp.join(',\n') + '\n];');
        console.log(umd('plurals', plurals.join(',\n\n')));
    }
}

function printCategoriesModule(es6) {
    const cc = common[MakePlural.ordinals ? 'combined' : 'cardinals'].categories;
    const categories = mapForEachLanguage(mp => {
        let cat = JSON.stringify(mp.categories).replace(/"(\w+)":/g, '$1:');
        cc.forEach(function(c, i) { if (cat === c) cat = `_cc[${i}]`; });
        return cat;
    });
    if (es6) {
        console.log('const _cc = [\n  ' + cc.join(',\n  ') + '\n];');
        console.log(es6module(categories.join(',\n')));
    } else {
        console.log('var _cc = [\n  ' + cc.join(',\n  ') + '\n];');
        console.log(umd('pluralCategories', categories.join(',\n')));
    }
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
        printCategoriesModule(argv.es6);
    } else {
        printPluralsModule(argv.es6);
    }
}

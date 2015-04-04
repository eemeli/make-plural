/** A compiler for make-plural.js
 *
 *  Usage:
 *    ./bin/make-plural                 // checks all locale rules
 *    ./bin/make-plural [lc]            // prints the locale function for LC
 *    ./bin/make-plural [lc] [n] [ord]  // prints the (ORD ? ordinal : plural) category for N in locale LC
 */

var argv = require('minimist')(process.argv.slice(2), {
        default: { locale: null, value: null, ordinal: null },
        alias: { locale: 'l', value: 'v', ordinal: 'o' },
        string: [ 'locale', 'value' ],
        boolean: [ 'ordinal' ]
    }),
    MakePlural = require('../make-plural').load(
        require('../data/plurals.json'),
        require('../data/ordinals.json')
    );
MakePlural.ordinals = true;

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


// UMD pattern adapted from https://github.com/umdjs/umd/blob/master/returnExports.js
const umd = {
    
pre: `
(function (root, plurals) {
  if (typeof define === 'function' && define.amd) {
    define(plurals);
  } else if (typeof exports === 'object') {
    module.exports = plurals;
  } else {
    root.plurals = plurals;
  }
}(this, {
`,

post: `
}));`

};


function printCompletePluralModule() {
    let languages = [];
    for (let lc in MakePlural.rules.cardinal) {
        const key = /^[A-Z_$][0-9A-Z_$]*$/i.test(lc) ? lc : JSON.stringify(lc),
              mp = new MakePlural(lc);
        let fn = mp.test().toString();
        commonPlurals.forEach(function(p, i) { if (fn === p) fn = `_cp[${i}]`; });
        languages.push(key + ': ' + fn);
    }

    console.log('var _cp = [');
    console.log(commonPlurals.join(',\n'));
    console.log('];')

    console.log(umd.pre);
    console.log(languages.join(',\n\n'));
    console.log(umd.post);
}



argv._.forEach(a => {
    if (argv.locale === null) argv.locale = a;
    else if (argv.value === null) argv.value = a;
    else if (argv.ordinal === null) argv.ordinal = !!a;
});
if (argv.locale) {
    const mp = new MakePlural(argv.locale).test();
    if (argv.value !== null) {
        console.log(mp(argv.value, argv.ordinal));
    } else {
        console.log(mp.toString(argv.locale));
    }
} else {
    printCompletePluralModule();
}

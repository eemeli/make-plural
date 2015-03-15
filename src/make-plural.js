/**
 * make-plural.js -- https://github.com/eemeli/make-plural.js/
 * Copyright (c) 2014-2015 by Eemeli Aro <eemeli@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * The software is provided "as is" and the author disclaims all warranties
 * with regard to this software including all implied warranties of
 * merchantability and fitness. In no event shall the author be liable for
 * any special, direct, indirect, or consequential damages or any damages
 * whatsoever resulting from loss of use, data or profits, whether in an
 * action of contract, negligence or other tortious action, arising out of
 * or in connection with the use or performance of this software.
 */

class Parser {
    parse(cond) {
        if (cond == 'i = 0 or n = 1') return 'n >= 0 && n <= 1';
        if (cond == 'i = 0,1') return 'n >= 0 && n < 2';
        if (cond == 'i = 1 and v = 0') {
            this.v0 = 1;
            return 'n == 1 && v0';
        }
        return cond
            .replace(/([tv]) (!?)= 0/g, (m, sym, noteq) => {
                const sn = sym + '0';
                this[sn] = 1;
                return noteq ? '!' + sn : sn;
            })
            .replace(/\b[fintv]\b/g, m => {
                this[m] = 1;
                return m;
            })
            .replace(/([fin]) % (10+)/g, (m, sym, num) => {
                const sn = sym + num;
                this[sn] = 1;
                return sn;
            })
            .replace(/n10+ = 0/g, 't0 && $&')
            .replace(/(\w+ (!?)= )([0-9.]+,[0-9.,]+)/g, (m, se, noteq, x) => {
                if (m == 'n = 0,1') return '(n == 0 || n == 1)';
                if (noteq) return se + x.split(',').join(' && ' + se);
                return '(' + se + x.split(',').join(' || ' + se) + ')';
            })
            .replace(/(\w+) (!?)= ([0-9]+)\.\.([0-9]+)/g, (m, sym, noteq, x0, x1) => {
                if (Number(x0) + 1 == Number(x1)) {
                    if (noteq) return `${sym} != ${x0} && ${sym} != ${x1}`;
                    return `(${sym} == ${x0} || ${sym} == ${x1})`;
                }
                if (noteq) return `(${sym} < ${x0} || ${sym} > ${x1})`;
                if (sym == 'n') { this.t0 = 1; return `(t0 && n >= ${x0} && n <= ${x1})`; }
                return `(${sym} >= ${x0} && ${sym} <= ${x1})`;
            })
            .replace(/ and /g, ' && ')
            .replace(/ or /g, ' || ')
            .replace(/ = /g, ' == ');
    };

    vars() {
        let vars = [];
        if (this.i) vars.push("i = s[0]");
        if (this.f || this.v) vars.push("f = s[1] || ''");
        if (this.t) vars.push("t = (s[1] || '').replace(/0+$/, '')");
        if (this.v) vars.push("v = f.length")
        if (this.v0) vars.push("v0 = !s[1]");
        if (this.t0 || this.n10 || this.n100) vars.push("t0 = Number(s[0]) == n");
        for (let k in this) if (/^.10+$/.test(k)) {
            const k0 = (k[0] == 'n') ? 't0 && s[0]' : k[0];
            vars.push(k + ' = ' + k0 + '.slice(-' + k.substr(2).length + ')');
        }
        if (!vars.length) return '';
        vars.unshift("s = String(n).split('.')");
        return 'var ' + vars.join(', ');
    }
}

class Rules {
    constructor() {
        this.data = {};
        this.rootPath = './data/';
    };

    loadData(cldr) {
        const data = cldr && cldr.supplemental || {};
        return this.data = {
            cardinal: data['plurals-type-cardinal'] || this.data.cardinal,
            ordinal:  data['plurals-type-ordinal']  || this.data.ordinal
        };
    };

    loadPath(path) {
        if (path.indexOf('/') == -1) path = this.rootPath + path;
        if (typeof require == 'function') {
            return this.loadData(require(path));
        }
        let xhr = new XMLHttpRequest();
        xhr.open('get', path, false);
        xhr.send();
        if (xhr.status != 200) throw new Error('XMLHttpRequest failed for ' + JSON.stringify(path));
        return this.loadData(JSON.parse(xhr.responseText));
    };

    get cardinal() {
        return this.data.cardinal || this.loadPath('unicode-cldr-plural-rules.json').cardinal;
    };

    get ordinal() {
        return this.data.ordinal || this.loadPath('unicode-cldr-ordinal-rules.json').ordinal;
    };
}

export default class MakePlural {
    constructor(lc, opt) {
        if (typeof lc == 'object') {
            opt = lc;
            lc = opt.lc;
        }
        this.lc = lc || MakePlural.lc;
        this.cardinals = opt && opt.cardinals || MakePlural.cardinals;
        this.ordinals = opt && opt.ordinals || MakePlural.ordinals;
        this.parser = new Parser();
        this.tests = { ordinal:{}, cardinal:{} };
        this.fn = this.build();
        this.fn.obj = this;
        this.fn.test = this.test.bind(this);
        this.fn.toString = this.fnToString.bind(this);
        return this.fn;
    };

    static load() {
        for (let i = 0; i < arguments.length; ++i) {
            let arg = arguments[i];
            if (typeof arg == 'string') MakePlural.rules.loadPath(arg);
            else MakePlural.rules.loadData(arg);
        }
        return MakePlural;
    };

    compile(type, req) {
        let cases = [];
        const rules = MakePlural.rules[type][this.lc];
        if (!rules) {
            if (req) throw new Error('Locale "' + this.lc + '" ' + type + ' rules not found');
            return "'other'";
        }
        for (let r in rules) {
            let parts = rules[r].split(/@\w*/);
            const cond = parts.shift().trim(),
                  cat = r.replace('pluralRule-count-', ''),
                  jsCond = cond && this.parser.parse(cond);
            if (cond) cases.push([jsCond, cat]);
            this.tests[type][cat] = parts.join(' ')
                                         .replace(/^[ ,]+|[ ,…]+$/g, '')
                                         .replace(/(0\.[0-9])~(1\.[1-9])/g, '$1 1.0 $2')
                                         .split(/[ ,~…]+/);
        }
        return (cases.length == 1) ? `(${cases[0][0]}) ? '${cases[0][1]}' : 'other'`
                                   : cases.map(c => `(${c[0]}) ? '${c[1]}'`)
                                          .concat("'other'")
                                          .join('\n      : ');
    }

    build() {
        let lines = (this.ordinals && this.cardinals) ? [ 'if (ord) return ' + this.compile('ordinal', false),
                                                                   'return ' + this.compile('cardinal', true) ]
                  : this.ordinals ? [ 'return ' + this.compile('ordinal', true) ]
                  : this.cardinals ? [ 'return ' + this.compile('cardinal', true) ]
                  : null;
        if (!lines) throw new Error('At least one type of plural is required');
        const args = this.ordinals && this.cardinals ? 'n, ord' : 'n',
              fold = { vars: str => `  ${str};`.replace(/(.{1,78})(,|$) ?/g,     '$1$2\n      '),
                       body: str => `  ${str};`.replace(/(.{1,78}) (\|\| |$) ?/gm, '$1\n          $2') },
              body = [ fold.vars(this.parser.vars()) ]
                         .concat(lines.map(fold.body))
                         .join('\n')
                         .replace(/\s+$/gm, '')
                         .replace(/^[\s;]*[\r\n]+/gm, '');
        return new Function(args, body);
    }

    testCond(n, ord, expResult) {
        try { var r = this.fn(n, ord); }
        catch (e) { r = e.toString(); }
        if (r != expResult) throw new Error(
            'Locale ' + JSON.stringify(this.lc) + (ord ? ' ordinal' : ' cardinal')
            + ' rule self-test failed for v = ' + JSON.stringify(n)
            + ' (was ' + JSON.stringify(r) + ', expected ' + JSON.stringify(expResult) + ')'
        );
        return true;
    };

    testCat(type, cat) {
        const ord = (type == 'ordinal');
        this.tests[type][cat].forEach( n => {
            this.testCond(n, ord, cat);
            /\.0+$/.test(n) || this.testCond(Number(n), ord, cat);
        });
        return true;
    };

    test() {
        for (let type in this.tests) {
            for (let cat in this.tests[type]) {
                this.testCat(type, cat);
            }
        }
        return this.fn;
    };

    fnToString(name) {
        return Function.prototype.toString.call(this.fn)
                   .replace(/^function( \w+)?/, name ? 'function ' + name : 'function')
                   .replace('\n/**/', '');
    };
}

MakePlural.cardinals = true;
MakePlural.ordinals = false;
MakePlural.rules = new Rules();

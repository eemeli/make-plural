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

class Symbols {
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

    toString() {
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
        return 'var ' + vars.join(', ') + ';';
    }
}

export default class MakePlural {
    constructor(lc, opt) {
        if (typeof lc == 'object') {
            this.opt = lc;
            this.lc = this.opt.lc;
        } else {
            this.opt = opt || MakePlural.opt;
            this.lc = lc || this.opt.lc;
        }
        this.symbols = new Symbols();
        this.tests = { 'ordinal':{}, 'cardinal':{} };
        const fn_body = this.build(),
              fn_args = this.opt.ordinals && !this.opt.no_cardinals ? 'n,ord' : 'n';
        if (!fn_body) return null;
        this.fn = new Function(fn_args, fn_body);
        this.fn.obj = this;
        this.fn.test = this.test.bind(this);
        this.fn.toString = this.fnToString.bind(this);
        return this.fn;
    };

    static load(/* arguments */) {
        if (!MakePlural.rules) MakePlural.rules = {};
        for (let i = 0; i < arguments.length; ++i) {  // for (let cldr of arguments) {
            let cldr = arguments[i];
            if (typeof cldr == 'string') {
                const path = (cldr.indexOf('/') == -1) ? MakePlural.dataRoot + cldr : cldr;
                if (typeof require == 'function') {
                    cldr = require(path);
                } else {
                    let xhr = new XMLHttpRequest();
                    xhr.open('get', path, false);
                    xhr.send();
                    if (xhr.status != 200) throw new Error('XMLHttpRequest failed for ' + JSON.stringify(path));
                    cldr = JSON.parse(xhr.responseText);
                }
            }
            if (cldr && cldr['supplemental']) for (let type in {cardinal:1, ordinal:1}) {  // for (let type of ['cardinal', 'ordinal']) {
                const set = cldr['supplemental']['plurals-type-' + type];
                if (set) MakePlural.rules[type] = set;
            }
        }
        return MakePlural;
    };

    compile(type, req) {
        let cases = [];
        if (!MakePlural.rules || !MakePlural.rules[type]) {
            MakePlural.load((type == 'ordinal')
                ? 'unicode-cldr-ordinal-rules.json'
                : 'unicode-cldr-plural-rules.json');
        }
        if (MakePlural.rules[type][this.lc]) {
            for (let r in MakePlural.rules[type][this.lc]) {
                let parts = MakePlural.rules[type][this.lc][r].split(/@\w*/);
                const cond = parts.shift().trim(),
                      key = r.replace('pluralRule-count-', '');
                if (cond) cases.push([this.symbols.parse(cond), key]);
                this.tests[type][key] = parts.join(' ')
                    .replace(/^[ ,]+|[ ,…]+$/g, '')
                    .replace(/(0\.[0-9])~(1\.[1-9])/g, '$1 1.0 $2')
                    .split(/[ ,~…]+/);
            }
        } else if (req) {
            throw new Error('Locale "' + this.lc + '" ' + type + ' rules not found');
        }
        switch (cases.length) {
            case 0: return "'other'";
            case 1: return "(" + cases[0][0] + ") ? '" + cases[0][1] + "' : 'other'";
            default: return cases.map(c => "(" + c[0] + ") ? '" + c[1] + "'").concat("'other'").join('\n      : ');
        }
    }

    build() {
        const fold = l => ('  ' + l + ';').replace(/(.{1,72})( \|\| |$) ?/gm, '$1\n         $2').replace(/\s+$/gm, '');
        let lines = [];
        try {
            if (this.opt.ordinals) {
                const ret = this.opt.no_cardinals ? 'return ' : 'if (ord) return ';
                lines.push(fold(ret + this.compile('ordinal', this.opt.no_cardinals)));
            }
            if (!this.opt.no_cardinals) {
                lines.push(fold('return ' + this.compile('cardinal', true)));
            }
        } catch (e) {
            if (this.opt.quiet) return null;
            throw e;
        }
        const fn_vars = this.symbols.toString().replace(/(.{1,78})(,|$) ?/g, '\n      $1$2').trim();
        if (fn_vars) lines.unshift('  ' + fn_vars);
        return lines.join('\n');
    }

    test() {
        const _test = (k, x, ord) => {
            try { var r = this.fn(x, ord); }
            catch (e) { r = e.toString(); }
            if (r != k) throw new Error(
                'Locale ' + JSON.stringify(this.lc) + (ord ? ' ordinal' : ' cardinal')
                + ' rule self-test failed for v = ' + JSON.stringify(x)
                + ' (was ' + JSON.stringify(r) + ', expected ' + JSON.stringify(k) + ')'
            );
            return true;
        };
        try {
            for (let t in this.tests) {
                const ord = (t == 'ordinal');
                for (let k in this.tests[t]) {
                    this.tests[t][k].forEach( v => {  // for (let v of this.tests[t][k]) {
                        _test(k, v, ord);
                        /\.0+$/.test(v) || _test(k, Number(v), ord);
                    });
                }
            }
        } catch (e) {
            if (this.opt.quiet) return null;
            throw e;
        }
        return this.fn;
    };

    fnToString(name) {
        const fn_str = Function.prototype.toString.call(this.fn);
        return fn_str.replace(/^function( \w+)?/, name ? 'function ' + name : 'function')
                     .replace('\n/**/', '');
    };
}

MakePlural.dataRoot = './data/';
MakePlural.opt = {};
MakePlural.rules = {};

/**
 * make-plural.js -- https://github.com/eemeli/make-plural.js/
 * Copyright (c) 2014 by Eemeli Aro <eemeli@gmail.com>
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

(function (global) {

function parse(cond, symbols) {
	if (cond == 'i = 0 or n = 1') return 'n >= 0 && n <= 1';
	if (cond == 'i = 0,1') return 'n >= 0 && n < 2';
	if (cond == 'i = 1 and v = 0') {
		symbols['v0'] = 1;
		return 'n == 1 && v0';
	}
	return cond
		.replace(/([tv]) (!?)= 0/g, function(m, sym, noteq) {
			var sn = sym + '0';
			symbols[sn] = 1;
			return noteq ? '!' + sn : sn;
		})
		.replace(/\b[fintv]\b/g, function(m) {
			symbols[m] = 1;
			return m;
		})
		.replace(/([fin]) % (10+)/g, function(m, sym, num) {
			var sn = sym + num;
			symbols[sn] = 1;
			return sn;
		})
		.replace(/n10+ = 0/g, 't0 && $&')
		.replace(/(\w+ (!?)= )([0-9.]+,[0-9.,]+)/g, function(m, se, noteq, x) {
			if (m == 'n = 0,1') return '(n == 0 || n == 1)';
			if (noteq) return se + x.split(',').join(' && ' + se);
			return '(' + se + x.split(',').join(' || ' + se) + ')';
		})
		.replace(/(\w+) (!?)= ([0-9]+)\.\.([0-9]+)/g, function(m, sym, noteq, x0, x1) {
			if (Number(x0) + 1 == Number(x1)) {
				if (noteq) return sym + ' != ' + x0 + ' && ' + sym + ' != ' + x1;
				return '(' + sym + ' == ' + x0 + ' || ' + sym + ' == ' + x1 + ')';
			}
			if (noteq) return '(' + sym + ' < '  + x0 + ' || ' + sym + ' > '  + x1 + ')';
			if (sym == 'n') { symbols['t0'] = 1; return '(t0 && n >= ' + x0 + ' && n <= ' + x1 + ')'; }
			return '(' + sym + ' >= ' + x0 + ' && ' + sym + ' <= ' + x1 + ')';
		})
		.replace(/ and /g, ' && ')
		.replace(/ or /g, ' || ')
		.replace(/ = /g, ' == ');
}

function test_values(str) {
	return str
		.replace(/decimal|integer/g, '')
		.replace(/^[ ,]+|[ ,…]+$/g, '')
		.replace(/(0\.[0-9])~(1\.[1-9])/g, '$1 1.0 $2')
		.split(/[ ,~…]+/);
}

function vars(symbols) {
	var vars = [];
	if (symbols['i']) vars.push("i = s[0]");
	if (symbols['f'] || symbols['v']) vars.push("f = s[1] || ''");
	if (symbols['t']) vars.push("t = (s[1] || '').replace(/0+$/, '')");
	if (symbols['v']) vars.push("v = f.length")
	if (symbols['v0']) vars.push("v0 = !s[1]");
	if (symbols['t0'] || symbols['n10'] || symbols['n100']) vars.push("t0 = Number(s[0]) == n");
	for (var k in symbols) if (/^.10+$/.test(k)) {
		var k0 = (k[0] == 'n') ? 't0 && s[0]' : k[0];
		vars.push(k + ' = ' + k0 + '.substr(-' + k.substr(2).length + ')');
	}
	if (vars.length) {
		vars.unshift("s = String(n).split('.')");
		return 'var ' + vars.join(', ') + ';';
	}
	return '';
}

function test(fn, tests, opt) {
	var	ok = true,
		_e = function(t) {
			ok = false;
			if (!opt['quiet']) console.error(
				'ERROR: plural rule self-test failed for v = '
				+ (typeof t == 'string' ? '"' + t + '"' : t)
				+ ' (was "' + fn(t) + '", expected "' + k + '")');
		};
	for (var k in tests) {
		tests[k].forEach(function(v) {
			if (fn(v) != k) _e(v);
			else if (!/\.0+$/.test(v) && fn(Number(v)) != k) _e(Number(v));
		});
	}
	return ok;
}

var rules, Plurals = {}

Plurals.set_rules = function(cldr) {
	if (!cldr) cldr = require('../data/unicode-cldr-plural-rules.json');
	else if (typeof cldr == 'string') cldr = require(cldr);
	rules = cldr['supplemental']['plurals-type-cardinal'];
};

Plurals.build = function(lc, opt) {
	var fn, fn_str, lines = [], symbols = {}, tests = {};
	if (!opt) opt = {};
	if (!rules) exports.set_rules();
	if (!rules[lc]) { if (!opt['quiet']) console.error('ERROR: locale "' + lc + '" not found'); return null; }
	for (var r in rules[lc]) {
		var	key = r.replace('pluralRule-count-', ''),
			parts = rules[lc][r].split(/@\w*/),
			cond = parts.shift().trim();
		if (cond) lines.push('if (' + parse(cond, symbols) + ') return \'' + key + '\';');
		tests[key] = test_values(parts.join(' '));
	}
	lines.unshift(vars(symbols));
	lines.push('return \'other\';');
	fn = new Function('n', lines.join('\n').trim());
	if (!opt['no_tests'] && !test(fn, tests, opt)) return null;
	if (opt['return_function']) return fn;
	fn_str = 'function(n) {\n  ' + lines.join('\n  ').trim() + '\n}';
	if (opt['minify']) fn_str = fn_str.replace(/\s+/g, '').replace(/{var/, '{var ');
	return fn_str;
};

if (typeof exports !== 'undefined') {
	exports.set_rules = Plurals.set_rules;
	exports.build = Plurals.build;
} else {
	global.Plurals = Plurals;
}

})(this);

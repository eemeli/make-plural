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

function test(lc, fn, tests, opt) {
	var	ok = true,
		_test = function(k, x, ord) {
			try { var r = fn(x, ord); }
			catch (e) { r = e.toString(); }
			if (r != k) {
				ok = false;
				if (!opt['quiet']) console.error(
					'Locale "' + lc + '" ' + (ord ? 'ordinal' : 'cardinal')
					+ ' rule self-test failed for v = '
					+ (typeof x == 'string' ? '"' + x + '"' : x)
					+ ' (was "' + r + '", expected "' + k + '")'
				);
				return false;
			}
			return true;
		};
	for (var t in tests) {
		var ord = (t == 'ordinal');
		for (var k in tests[t]) {
			tests[t][k].forEach(function(v) {
				if (_test(k, v, ord) && !/\.0+$/.test(v)) _test(k, Number(v), ord);
			});
		}
	}
	return ok;
}

var Plurals = {};

Plurals.set_rules = function(cldr) {
	var _require = (typeof require == 'function') ? require : function(url) {
		if (Plurals.src_url && (url[0] == '.')) url = Plurals.src_url.replace(/[^\/]*$/, url);
		var xhr = new XMLHttpRequest();
		xhr.open('get', url, false);
		xhr.send();
		return (xhr.status == 200) && JSON.parse(xhr.responseText);
	};
	if (typeof cldr == 'string') cldr = _require(cldr);
	if (cldr && cldr['supplemental']) {
		if (!Plurals.rules) Plurals.rules = {};
		if ('plurals-type-cardinal' in cldr['supplemental']) {
			Plurals.rules['cardinal'] = cldr['supplemental']['plurals-type-cardinal'];
		}
		if ('plurals-type-ordinal' in cldr['supplemental']) {
			Plurals.rules['ordinal'] = cldr['supplemental']['plurals-type-ordinal'];
		}
	}
};

Plurals.build = function(lc, opt) {
	var	fn, fn_str, fn_vars, lines = [], symbols = {},
		tests = { 'ordinal':{}, 'cardinal':{} },
		_compile = function(type, indent, req) {
			var cases = [];
			if (!Plurals.rules || !Plurals.rules[type]) {
				Plurals.set_rules((type == 'ordinal')
					? './data/unicode-cldr-ordinal-rules.json'
					: './data/unicode-cldr-plural-rules.json');
			}
			if (Plurals.rules[type][lc]) {
				for (var r in Plurals.rules[type][lc]) {
					var	key = r.replace('pluralRule-count-', ''),
						parts = Plurals.rules[type][lc][r].split(/@\w*/),
						cond = parts.shift().trim();
					if (cond) cases.push([parse(cond, symbols), key]);
					tests[type][key] = test_values(parts.join(' '));
				}
			} else if (req) {
				if (!opt['quiet']) console.error('Locale "' + lc + '" ' + type + ' rules not found');
				return false;
			}
			if (!cases.length) return "'other'";
			if (cases.length == 1) return "(" + cases[0][0] + ") ? '" + cases[0][1] + "' : 'other'";
			return cases.map(function(c) { return "(" + c[0] + ") ? '" + c[1] + "'"; }).concat("'other'").join('\n      : ');
		}, _fold = function(l) {
			return l.replace(/(.{1,72})( \|\| |$) ?/gm, '$1\n         $2').replace(/\s+$/gm, '');
		};
	if (!opt) opt = {};
	if (opt['ordinals']) {
		if (opt['no_cardinals']) {
			var l = _compile('ordinal', '  ', true);
			if (!l) return null;
			lines.push(_fold('  return ' + l + ';'));
		} else {
			lines.push(_fold('  if (ord) return ' + _compile('ordinal', '    ', false) + ';'));
		}
	}
	if (!opt['no_cardinals']) {
		var l = _compile('cardinal', '  ', true);
		if (!l) return null;
		lines.push(_fold('  return ' + l + ';'));
	}
	fn_vars = vars(symbols).replace(/(.{1,78})(,|$) ?/g, '\n      $1$2').trim();
	if (fn_vars) lines.unshift('  ' + fn_vars);
	fn = new Function('n', 'ord', lines.join('\n').trim());
	if (!opt['no_tests'] && !test(lc, fn, tests, opt)) return null;
	if (opt['return_function']) return fn;
	fn_str = (opt['ordinals'] && !opt['no_cardinals'] ? 'function(n,ord)' : 'function(n)')
		+ ' {\n' + lines.join('\n').replace(/{\s*(return [^;]+;)\s*}/, '$1') + '\n}';
	if (opt['minify']) fn_str = fn_str.replace(/\s+/g, '').replace(/{var/, '{var ');
	return fn_str;
};

if ((typeof module !== 'undefined') && module.exports) {
	module.exports = Plurals;
} else if (typeof exports !== 'undefined') {
	// won't expose Plurals.rules
	for (var p in Plurals) exports[p] = Plurals[p];
} else {
	try { Plurals.src_url = Array.prototype.slice.call(document.getElementsByTagName('script')).pop().src; }
	catch (e) { Plurals.src_url = ''; }
	global.Plurals = Plurals;
}

})(this);

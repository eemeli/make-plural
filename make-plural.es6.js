"use strict";

var _toArray = function (arr) { return Array.isArray(arr) ? arr : Array.from(arr); };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var Parser = (function () {
    function Parser() {
        _classCallCheck(this, Parser);
    }

    _createClass(Parser, {
        parse: {
            value: function parse(cond) {
                var _this = this;

                if (cond === "i = 0 or n = 1") {
                    return "n >= 0 && n <= 1";
                }if (cond === "i = 0,1") {
                    return "n >= 0 && n < 2";
                }if (cond === "i = 1 and v = 0") {
                    this.v0 = 1;
                    return "n == 1 && v0";
                }
                return cond.replace(/([tv]) (!?)= 0/g, function (m, sym, noteq) {
                    var sn = sym + "0";
                    _this[sn] = 1;
                    return noteq ? "!" + sn : sn;
                }).replace(/\b[fintv]\b/g, function (m) {
                    _this[m] = 1;
                    return m;
                }).replace(/([fin]) % (10+)/g, function (m, sym, num) {
                    var sn = sym + num;
                    _this[sn] = 1;
                    return sn;
                }).replace(/n10+ = 0/g, "t0 && $&").replace(/(\w+ (!?)= )([0-9.]+,[0-9.,]+)/g, function (m, se, noteq, x) {
                    if (m === "n = 0,1") return "(n == 0 || n == 1)";
                    if (noteq) return se + x.split(",").join(" && " + se);
                    return "(" + se + x.split(",").join(" || " + se) + ")";
                }).replace(/(\w+) (!?)= ([0-9]+)\.\.([0-9]+)/g, function (m, sym, noteq, x0, x1) {
                    if (Number(x0) + 1 === Number(x1)) {
                        if (noteq) return "" + sym + " != " + x0 + " && " + sym + " != " + x1;
                        return "(" + sym + " == " + x0 + " || " + sym + " == " + x1 + ")";
                    }
                    if (noteq) return "(" + sym + " < " + x0 + " || " + sym + " > " + x1 + ")";
                    if (sym === "n") {
                        _this.t0 = 1;return "(t0 && n >= " + x0 + " && n <= " + x1 + ")";
                    }
                    return "(" + sym + " >= " + x0 + " && " + sym + " <= " + x1 + ")";
                }).replace(/ and /g, " && ").replace(/ or /g, " || ").replace(/ = /g, " == ");
            }
        },
        vars: {
            value: function vars() {
                var vars = [];
                if (this.i) vars.push("i = s[0]");
                if (this.f || this.v) vars.push("f = s[1] || ''");
                if (this.t) vars.push("t = (s[1] || '').replace(/0+$/, '')");
                if (this.v) vars.push("v = f.length");
                if (this.v0) vars.push("v0 = !s[1]");
                if (this.t0 || this.n10 || this.n100) vars.push("t0 = Number(s[0]) == n");
                for (var k in this) {
                    if (/^.10+$/.test(k)) {
                        var k0 = k[0] === "n" ? "t0 && s[0]" : k[0];
                        vars.push("" + k + " = " + k0 + ".slice(-" + k.substr(2).length + ")");
                    }
                }if (!vars.length) {
                    return "";
                }return "var " + ["s = String(n).split('.')"].concat(vars).join(", ");
            }
        }
    });

    return Parser;
})();

var Rules = (function () {
    function Rules() {
        _classCallCheck(this, Rules);

        this.data = {};
        this.rootPath = "./data/";
    }

    _createClass(Rules, {
        loadData: {
            value: function loadData(cldr) {
                var data = cldr && cldr.supplemental || {};
                this.data = {
                    cardinal: data["plurals-type-cardinal"] || this.data.cardinal,
                    ordinal: data["plurals-type-ordinal"] || this.data.ordinal
                };
                return this.data;
            }
        },
        loadPath: {
            value: function loadPath(path) {
                if (path.indexOf("/") === -1) path = this.rootPath + path;
                return this.loadData(require(path));
            }
        },
        cardinal: {
            get: function () {
                return this.data.cardinal || this.loadPath("plurals.json").cardinal;
            }
        },
        ordinal: {
            get: function () {
                return this.data.ordinal || this.loadPath("ordinals.json").ordinal;
            }
        }
    });

    return Rules;
})();

var Tests = (function () {
    function Tests(obj) {
        _classCallCheck(this, Tests);

        this.obj = obj;
        this.ordinal = {};
        this.cardinal = {};
    }

    _createClass(Tests, {
        add: {
            value: function add(type, cat, examples) {
                this[type][cat] = examples.join(" ").replace(/^[ ,]+|[ ,…]+$/g, "").replace(/(0\.[0-9])~(1\.[1-9])/g, "$1 1.0 $2").split(/[ ,~…]+/);
            }
        },
        testCond: {
            value: function testCond(n, type, expResult) {
                try {
                    var r = this.obj.fn(n, type === "ordinal");
                } catch (e) {
                    r = e.toString();
                }
                if (r !== expResult) {
                    throw new Error("Locale " + JSON.stringify(this.obj.lc) + type + " rule self-test failed for v = " + JSON.stringify(n) + " (was " + JSON.stringify(r) + ", expected " + JSON.stringify(expResult) + ")");
                }
                return true;
            }
        },
        testCat: {
            value: function testCat(type, cat) {
                var _this = this;

                this[type][cat].forEach(function (n) {
                    _this.testCond(n, type, cat);
                    if (!/\.0+$/.test(n)) _this.testCond(Number(n), type, cat);
                });
                return true;
            }
        },
        testAll: {
            value: function testAll() {
                for (var cat in this.cardinal) {
                    this.testCat("cardinal", cat);
                }for (var cat in this.ordinal) {
                    this.testCat("ordinal", cat);
                }return true;
            }
        }
    });

    return Tests;
})();

var MakePlural = (function () {
    function MakePlural(lc) {
        var opt = arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, MakePlural);

        if (typeof lc == "object") {
            opt = lc;
            lc = opt.lc;
        }
        this.lc = lc || MakePlural.lc;
        this.cardinals = opt.cardinals || MakePlural.cardinals;
        this.ordinals = opt.ordinals || MakePlural.ordinals;
        if (!this.ordinals && !this.cardinals) throw new Error("At least one type of plural is required");
        this.parser = new Parser();
        this.tests = new Tests(this);
        this.fn = this.buildFunction();
        this.fn.obj = this;
        this.fn.test = (function () {
            return this.tests.testAll() && this.fn;
        }).bind(this);
        this.fn.toString = this.fnToString.bind(this);
        return this.fn;
    }

    _createClass(MakePlural, {
        compile: {
            value: function compile(type, req) {
                var cases = [];
                var rules = MakePlural.rules[type][this.lc];
                if (!rules) {
                    if (req) throw new Error("Locale \"" + this.lc + "\" " + type + " rules not found");
                    return "'other'";
                }
                for (var r in rules) {
                    var _rules$r$trim$split = rules[r].trim().split(/\s*@\w*/);

                    var _rules$r$trim$split2 = _toArray(_rules$r$trim$split);

                    var cond = _rules$r$trim$split2[0];
                    var examples = _rules$r$trim$split2.slice(1);
                    var cat = r.replace("pluralRule-count-", "");
                    if (cond) cases.push([this.parser.parse(cond), cat]);
                    this.tests.add(type, cat, examples);
                }
                if (cases.length === 1) {
                    return "(" + cases[0][0] + ") ? '" + cases[0][1] + "' : 'other'";
                } else {
                    return [].concat(_toConsumableArray(cases.map(function (c) {
                        return "(" + c[0] + ") ? '" + c[1] + "'";
                    })), ["'other'"]).join("\n      : ");
                }
            }
        },
        buildFunction: {
            value: function buildFunction() {
                var _this = this;

                var compile = function (c) {
                    var _ref;

                    return c ? (c[1] ? "return " : "if (ord) return ") + (_ref = _this).compile.apply(_ref, _toConsumableArray(c)) : "";
                },
                    fold = { vars: function (str) {
                        return ("  " + str + ";").replace(/(.{1,78})(,|$) ?/g, "$1$2\n      ");
                    },
                    cond: function (str) {
                        return ("  " + str + ";").replace(/(.{1,78}) (\|\| |$) ?/gm, "$1\n          $2");
                    } },
                    cond = [this.ordinals && ["ordinal", !this.cardinals], this.cardinals && ["cardinal", true]].map(compile).map(fold.cond),
                    body = [fold.vars(this.parser.vars())].concat(_toConsumableArray(cond)).join("\n").replace(/\s+$/gm, "").replace(/^[\s;]*[\r\n]+/gm, ""),
                    args = this.ordinals && this.cardinals ? "n, ord" : "n";
                return new Function(args, body);
            }
        },
        fnToString: {
            value: function fnToString(name) {
                return Function.prototype.toString.call(this.fn).replace(/^function( \w+)?/, name ? "function " + name : "function").replace("\n/**/", "");
            }
        }
    }, {
        load: {
            value: function load() {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                args.forEach(function (arg) {
                    if (typeof arg == "string") MakePlural.rules.loadPath(arg);else MakePlural.rules.loadData(arg);
                });
                return MakePlural;
            }
        }
    });

    return MakePlural;
})();

export default MakePlural;

MakePlural.cardinals = true;
MakePlural.ordinals = false;
MakePlural.rules = new Rules();

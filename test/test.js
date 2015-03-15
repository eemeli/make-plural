describe('MakePlural class', function(){
    it('should have data members', function(){
        expect(MakePlural).to.have.keys('cardinals', 'ordinals', 'rules');
    });

    describe('.rules', function(){
        it('#loadData() should load data from an object', function(){
            var cldr = { supplemental: { 'plurals-type-cardinal': { xx: {
                'pluralRule-count-one': 'n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000',
                'pluralRule-count-other': ' @integer 0, 2~16, 100, 1000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, …'
            }}}};
            expect(MakePlural.rules.loadData(cldr)).to.only.have.keys('cardinal', 'ordinal');
            expect(MakePlural.rules.cardinal).to.only.have.key('xx');
        });
        it('#loadPath() should load data from a path', function(){
            expect(MakePlural.rules.loadPath('unicode-cldr-plural-rules.json').cardinal).to.not.have.key('xx');
            expect(MakePlural.rules.cardinal).to.have.key('en');
        });
    });

    describe('.load()', function(){
        it('should require valid parameters', function(){
            expect(MakePlural.load).to.not.throwException();
            expect(MakePlural.load).withArgs('').to.throwException();
        });
        it('should load custom CLDR data', function(){
            var cldr = { supplemental: { 'plurals-type-cardinal': { xx: {
                'pluralRule-count-one': 'n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000',
                'pluralRule-count-other': ' @integer 0, 2~16, 100, 1000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, …'
            }}}};
            MakePlural.load(cldr);
            expect(MakePlural.rules.data).to.have.key('cardinal');
            expect(MakePlural.rules.cardinal).to.only.have.key('xx');
        });
        it('should load default CLDR data', function(){
            expect(MakePlural.load).withArgs('unicode-cldr-plural-rules.json', 'unicode-cldr-ordinal-rules.json').to.not.throwException();
            expect(MakePlural.rules.data).to.only.have.keys('cardinal', 'ordinal');
            expect(MakePlural.rules.cardinal).to.not.have.key('xx');
            expect(MakePlural.rules.cardinal).to.have.key('en');
            expect(MakePlural.rules.ordinal).to.have.key('en');
        });
        it('should return MakePlural', function(){
            expect(MakePlural.load()).to.be(MakePlural);
        });
    });

    describe('MakePlural()', function(){
        it('should require `new`', function(){
            expect(MakePlural).to.throwException(function(e){
                expect(e).to.be.a(TypeError);
                expect(e.message).to.contain('class');
            });
        });
        it('should require a locale', function(){
            var new_mp = function(lc) { return new MakePlural(lc); };
            expect(new_mp).to.throwException();
            expect(new_mp).withArgs('en').to.not.throwException();
        });
        it('should autoload default CLDR data', function(){
            MakePlural.rules.data = {};
            var mp = new MakePlural('en');
            expect(MakePlural.rules.data).to.have.key('cardinal');
            expect(MakePlural.rules.cardinal).to.have.key('en');
        });
        it('should return a pluralization function', function(){
            var mp = new MakePlural('en');
            expect(mp).to.be.a(Function);
            expect(mp(1)).to.be('one');
        });
        it('should handle local options', function(){
            var mp = new MakePlural({ lc: 'en', ordinals: true });
            expect(mp(2, true)).to.be('two');
        });
        it('should handle global options', function(){
            MakePlural.lc = 'en'
            MakePlural.ordinals = true;
            var mp = new MakePlural();
            expect(mp(2, true)).to.be('two');
            delete MakePlural.lc;
            MakePlural.ordinals = false;
        });
    });

    describe('#test()', function(){
        it('should validate default functions', function(){
            var mp = new MakePlural('en', { ordinals: true });
            expect(mp.test()).to.be(mp);
        });
        it('should not validate bad functions', function(){
            var cldr = { supplemental: { 'plurals-type-cardinal': { xx: {
                'pluralRule-count-one': 'n = 1 @integer 2',
                'pluralRule-count-other': ''
            }}}};
            MakePlural.load(cldr);
            var mp = new MakePlural('xx');
            expect(mp.test).to.throwException(function(e){
                expect(e.message).to.contain('self-test failed');
            });
            MakePlural.rules.data = {};

        });
    });

    describe('#toString()', function(){
        var mp = new MakePlural('en', { ordinals: true });
        it('should return a string', function(){
            expect(mp.toString()).to.contain('function');
        });
        it('which can be eval\'d as a function', function(){
            var fn = eval('(' + mp.toString() + ')');
            expect(fn).to.be.a(Function);
            expect(fn(1)).to.be('one');
            expect(fn(2, true)).to.be('two');
        });
    });
});

describe('MakePlural data', function(){
    describe('Cardinal rules', function(){
        for (var lc in MakePlural.rules.cardinal) {
            describe(lc, function(){
                (function (lc) {
                    it('has autogenerated tests', function(){
                        var mp;
                        expect(mp = new MakePlural(lc, { ordinals: false })).to.not.throwException();
                        expect(mp.obj.tests.cardinal).to.not.be.empty();
                    });

                    var mp = new MakePlural(lc, { ordinals: false });
                    for (var cat in mp.obj.tests.cardinal) {
                        (function (cat) {
                            it(cat, function() {
                                expect(mp.obj.testCat.bind(mp.obj)).withArgs('cardinal', cat).to.not.throwException();
                            });
                        })(cat);
                    }
                })(lc);
            });
        }
    });

    describe('Ordinal rules', function(){
        for (var lc in MakePlural.rules.ordinal) {
            describe(lc, function(){
                (function (lc) {
                    it('has autogenerated tests', function(){
                        var mp;
                        expect(mp = new MakePlural(lc, { ordinals: true })).to.not.throwException();
                        expect(mp.obj.tests.ordinal).to.not.be.empty();
                    });

                    var mp = new MakePlural(lc, { ordinals: true });
                    for (var cat in mp.obj.tests.ordinal) {
                        (function (cat) {
                            it(cat, function() {
                                expect(mp.obj.testCat.bind(mp.obj)).withArgs('ordinal', cat).to.not.throwException();
                            });
                        })(cat);
                    }
                })(lc);
            });
        }
    });
});

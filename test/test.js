describe('MakePlural object', function(){
    it('should have data members', function(){
        expect(MakePlural).to.have.keys('opt', 'rules');
    });
    describe('.load()', function(){
        it('should require valid parameters', function(){
            expect(MakePlural.load).to.not.throwException();
            expect(MakePlural.load).withArgs('').to.throwException();
            expect(MakePlural.load).withArgs('unicode-cldr-plural-rules.json').to.not.throwException();
        });
        it('should load custom CLDR data', function(){
            var cldr = { supplemental: { 'plurals-type-cardinal': { xx: {
                'pluralRule-count-one': 'n = 1 @integer 1 @decimal 1.0, 1.00, 1.000, 1.0000',
                'pluralRule-count-other': ' @integer 0, 2~16, 100, 1000, … @decimal 0.0~0.9, 1.1~1.6, 10.0, 100.0, 1000.0, …'
            }}}};
            MakePlural.load(cldr);
            expect(MakePlural.rules).to.have.key('cardinal');
            expect(MakePlural.rules.cardinal).to.only.have.key('xx');
        });
        it('should load default CLDR data', function(){
            MakePlural.load('unicode-cldr-plural-rules.json');
            MakePlural.load('unicode-cldr-ordinal-rules.json');
            expect(MakePlural.rules).to.only.have.keys('cardinal', 'ordinal');
            expect(MakePlural.rules.cardinal).to.not.have.key('xx');
            expect(MakePlural.rules.cardinal).to.have.key('en');
            expect(MakePlural.rules.ordinal).to.have.key('en');
        });
        it('should return MakePlural', function(){
            expect(MakePlural.load()).to.be(MakePlural);
        });
    });

    describe('MakePlural()', function(){
        it('should require a locale', function(){
            var new_mp = function(lc) { return new MakePlural(lc); };
            expect(new_mp).to.throwException();
            expect(new_mp).withArgs('en').to.not.throwException();
        });
        it('should autoload default CLDR data', function(){
            delete MakePlural.rules;
            var mp = new MakePlural('en');
            expect(MakePlural.rules).to.have.key('cardinal');
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
            MakePlural.opt = { lc: 'en', ordinals: true };
            var mp = new MakePlural();
            expect(mp(2, true)).to.be('two');
            MakePlural.opt = {};
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
    for (var lc in MakePlural.rules.cardinal) (function (lc) {
        it(lc, function(){
            var mp;
            expect(mp = new MakePlural(lc, { ordinals: true })).to.not.throwException();
            expect(mp).to.not.be(null);
            expect(mp(2)).to.be.a('string');
            expect(mp(1)).to.match(/^(one|other)$/);
        });
    })(lc);
});

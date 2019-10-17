var z = "zero", o = "one", t = "two", f = "few", m = "many", x = "other";
var a = {cardinal:[o,x],ordinal:[x]};
var b = {cardinal:[x],ordinal:[x]};
var c = {cardinal:[o,f,m,x],ordinal:[x]};
var d = {cardinal:[o,x],ordinal:[o,x]};
var e = {cardinal:[o,t,x],ordinal:[x]};

(function (root, pluralCategories) {
  if (typeof define === 'function' && define.amd) {
    define(pluralCategories);
  } else if (typeof exports === 'object') {
    module.exports = pluralCategories;
  } else {
    root.pluralCategories = pluralCategories;
  }
}(this, {
_in: b,
af: a,
ak: a,
am: a,
an: a,
ar: {cardinal:[z,o,t,f,m,x],ordinal:[x]},
ars: {cardinal:[z,o,t,f,m,x],ordinal:[x]},
as: {cardinal:[o,x],ordinal:[o,t,f,m,x]},
asa: a,
ast: a,
az: {cardinal:[o,x],ordinal:[o,f,m,x]},
be: {cardinal:[o,f,m,x],ordinal:[f,x]},
bem: a,
bez: a,
bg: a,
bho: a,
bm: b,
bn: {cardinal:[o,x],ordinal:[o,t,f,m,x]},
bo: b,
br: {cardinal:[o,t,f,m,x],ordinal:[x]},
brx: a,
bs: {cardinal:[o,f,x],ordinal:[x]},
ca: {cardinal:[o,x],ordinal:[o,t,f,x]},
ce: a,
ceb: a,
cgg: a,
chr: a,
ckb: a,
cs: c,
cy: {cardinal:[z,o,t,f,m,x],ordinal:[z,o,t,f,m,x]},
da: a,
de: a,
dsb: {cardinal:[o,t,f,x],ordinal:[x]},
dv: a,
dz: b,
ee: a,
el: a,
en: {cardinal:[o,x],ordinal:[o,t,f,x]},
eo: a,
es: a,
et: a,
eu: a,
fa: a,
ff: a,
fi: a,
fil: d,
fo: a,
fr: d,
fur: a,
fy: a,
ga: {cardinal:[o,t,f,m,x],ordinal:[o,x]},
gd: {cardinal:[o,t,f,x],ordinal:[o,t,f,x]},
gl: a,
gsw: a,
gu: {cardinal:[o,x],ordinal:[o,t,f,m,x]},
guw: a,
gv: {cardinal:[o,t,f,m,x],ordinal:[x]},
ha: a,
haw: a,
he: {cardinal:[o,t,m,x],ordinal:[x]},
hi: {cardinal:[o,x],ordinal:[o,t,f,m,x]},
hr: {cardinal:[o,f,x],ordinal:[x]},
hsb: {cardinal:[o,t,f,x],ordinal:[x]},
hu: d,
hy: d,
ia: a,
id: b,
ig: b,
ii: b,
io: a,
is: a,
it: {cardinal:[o,x],ordinal:[m,x]},
iu: e,
iw: {cardinal:[o,t,m,x],ordinal:[x]},
ja: b,
jbo: b,
jgo: a,
ji: a,
jmc: a,
jv: b,
jw: b,
ka: {cardinal:[o,x],ordinal:[o,m,x]},
kab: a,
kaj: a,
kcg: a,
kde: b,
kea: b,
kk: {cardinal:[o,x],ordinal:[m,x]},
kkj: a,
kl: a,
km: b,
kn: a,
ko: b,
ks: a,
ksb: a,
ksh: {cardinal:[z,o,x],ordinal:[x]},
ku: a,
kw: {cardinal:[z,o,t,f,m,x],ordinal:[o,m,x]},
ky: a,
lag: {cardinal:[z,o,x],ordinal:[x]},
lb: a,
lg: a,
lkt: b,
ln: a,
lo: {cardinal:[x],ordinal:[o,x]},
lt: c,
lv: {cardinal:[z,o,x],ordinal:[x]},
mas: a,
mg: a,
mgo: a,
mk: {cardinal:[o,x],ordinal:[o,t,m,x]},
ml: a,
mn: a,
mo: {cardinal:[o,f,x],ordinal:[o,x]},
mr: {cardinal:[o,x],ordinal:[o,t,f,x]},
ms: {cardinal:[x],ordinal:[o,x]},
mt: c,
my: b,
nah: a,
naq: e,
nb: a,
nd: a,
ne: d,
nl: a,
nn: a,
nnh: a,
no: a,
nqo: b,
nr: a,
nso: a,
ny: a,
nyn: a,
om: a,
or: {cardinal:[o,x],ordinal:[o,t,f,m,x]},
os: a,
osa: b,
pa: a,
pap: a,
pl: c,
prg: {cardinal:[z,o,x],ordinal:[x]},
ps: a,
pt: a,
pt_PT: a,
rm: a,
ro: {cardinal:[o,f,x],ordinal:[o,x]},
rof: a,
root: b,
ru: c,
rwk: a,
sah: b,
saq: a,
sc: {cardinal:[o,x],ordinal:[m,x]},
scn: {cardinal:[o,x],ordinal:[m,x]},
sd: a,
sdh: a,
se: e,
seh: a,
ses: b,
sg: b,
sh: {cardinal:[o,f,x],ordinal:[x]},
shi: {cardinal:[o,f,x],ordinal:[x]},
si: a,
sk: c,
sl: {cardinal:[o,t,f,x],ordinal:[x]},
sma: e,
smi: e,
smj: e,
smn: e,
sms: e,
sn: a,
so: a,
sq: {cardinal:[o,x],ordinal:[o,m,x]},
sr: {cardinal:[o,f,x],ordinal:[x]},
ss: a,
ssy: a,
st: a,
su: b,
sv: d,
sw: a,
syr: a,
ta: a,
te: a,
teo: a,
th: b,
ti: a,
tig: a,
tk: {cardinal:[o,x],ordinal:[f,x]},
tl: d,
tn: a,
to: b,
tr: a,
ts: a,
tzm: a,
ug: a,
uk: {cardinal:[o,f,m,x],ordinal:[f,x]},
ur: a,
uz: a,
ve: a,
vi: {cardinal:[x],ordinal:[o,x]},
vo: a,
vun: a,
wa: a,
wae: a,
wo: b,
xh: a,
xog: a,
yi: a,
yo: b,
yue: b,
zh: b,
zu: a
}));

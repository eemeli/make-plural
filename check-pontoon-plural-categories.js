const categories = {
  tg: ['one', 'other'],
  om: ['other'],
  cnh: ['one', 'other'],
  jv: ['other'],
  nd: ['one', 'other'],
  ba: ['one', 'other'],
  dyu: ['other'],
  kpv: ['one', 'other'],
  lus: ['other'],
  ve: ['one', 'other'],
  kab: ['one', 'other'],
  th: ['other'],
  bm: ['other'],
  dv: ['one', 'other'],
  fo: ['one', 'other'],
  ak: ['one', 'other'],
  lo: ['other'],
  ee: ['one', 'other'],
  ach: ['one', 'other'],
  'rm-sursilv': ['one', 'other'],
  'rm-vallader': ['one', 'other'],
  ady: ['one', 'other'],
  hyw: ['one', 'other'],
  shi: ['one', 'other'],
  sdh: ['one', 'other'],
  gl: ['one', 'other'],
  quc: ['one', 'other'],
  vi: ['other'],
  tk: ['one', 'other'],
  et: ['one', 'other'],
  ts: ['one', 'other'],
  hye: ['one', 'other'],
  bg: ['one', 'other'],
  hr: ['one', 'few', 'other'],
  ace: ['other'],
  ca: ['one', 'other'],
  is: ['one', 'other'],
  bas: ['one', 'other'],
  bxr: ['one', 'other'],
  yi: ['one', 'other'],
  de: ['one', 'other'],
  ru: ['one', 'few', 'many'],
  gor: ['other'],
  rw: ['one', 'other'],
  hi: ['one', 'other'],
  fr: ['one', 'other'],
  ar: ['zero', 'one', 'two', 'few', 'many', 'other'],
  an: ['one', 'other'],
  he: ['one', 'other'],
  br: ['one', 'two', 'few', 'many', 'other'],
  cs: ['one', 'few', 'other'],
  ab: ['one', 'other'],
  izh: ['one', 'other'],
  dag: ['zero', 'one', 'other'],
  jbo: ['zero'],
  ie: ['two'],
  byv: ['zero', 'one', 'other'],
  ixl: ['one', 'other'],
  su: ['other'],
  it: ['one', 'other'],
  sl: ['one', 'two', 'few', 'other'],
  'zh-TW': ['other'],
  'zh-CN': ['other'],
  'pt-PT': ['one', 'other'],
  'es-ES': ['one', 'other'],
  'hy-AM': ['one', 'other'],
  lij: ['one', 'other'],
  skr: ['one', 'other'],
  oc: ['one', 'other'],
  gv: ['one', 'two', 'few', 'other'],
  kbd: ['one', 'other'],
  az: ['one', 'other'],
  tt: ['one', 'other'],
  el: ['one', 'other'],
  id: ['other'],
  'pa-IN': ['one', 'other'],
  'es-CL': ['one', 'other'],
  gom: ['one', 'other'],
  pt: ['one', 'other'],
  es: ['one', 'other'],
  ki: ['one', 'other'],
  tsz: ['one', 'other'],
  lt: ['one', 'few', 'other'],
  'ne-NP': ['one', 'other'],
  uby: ['one', 'other'],
  sr: ['one', 'few', 'other'],
  anp: ['one', 'other'],
  udm: ['one', 'other'],
  yua: ['one', 'other'],
  tw: ['one', 'other'],
  en: ['one', 'other'],
  'en-US': ['one', 'other'],
  uk: ['one', 'few', 'many'],
  ht: ['one', 'other'],
  ha: ['one', 'other'],
  ig: ['one', 'other'],
  kaa: ['one', 'other'],
  csb: ['one', 'few', 'other'],
  ln: ['one', 'other'],
  mg: ['one', 'other'],
  nso: ['one', 'other'],
  brx: ['one', 'other'],
  hus: ['other'],
  ses: ['one', 'other'],
  af: ['one', 'other'],
  gn: ['one', 'other'],
  tn: ['one', 'other'],
  sn: ['one', 'other'],
  ay: ['one', 'other'],
  yue: ['other'],
  cy: ['zero', 'one', 'two', 'few', 'many', 'other'],
  'en-ZA': ['one', 'other'],
  ka: ['one', 'other'],
  ky: ['one', 'other'],
  eo: ['one', 'other'],
  mr: ['one', 'other'],
  'es-MX': ['one', 'other'],
  crh: ['one', 'other'],
  sah: ['one', 'other'],
  ban: ['other'],
  da: ['one', 'other'],
  myv: ['one', 'other'],
  mt: ['one', 'two', 'many'],
  ko: ['other'],
  tyv: ['one', 'other'],
  sc: ['one', 'other'],
  zgh: ['one', 'other'],
  km: ['other'],
  mos: ['one', 'other'],
  'pap-AW': ['other'],
  ps: ['one', 'other'],
  syr: ['zero', 'one', 'two', 'few', 'many', 'other'],
  ty: ['other'],
  'nn-NO': ['one', 'other'],
  mn: ['one', 'other'],
  'pt-BR': ['one', 'other'],
  ss: ['one', 'other'],
  so: ['other'],
  vot: ['one', 'other'],
  zza: ['other'],
  sq: ['one', 'other'],
  be: ['one', 'few', 'many'],
  tr: ['one', 'other'],
  mni: ['one', 'other'],
  sat: ['one', 'two', 'other'],
  kw: ['zero', 'one', 'two', 'few', 'many', 'other'],
  st: ['one', 'other'],
  qvi: ['one', 'other'],
  quy: ['one', 'other'],
  'bn-BD': ['one', 'other'],
  'nan-tw': [],
  am: ['one', 'other'],
  tig: ['one', 'other'],
  sco: ['one', 'other'],
  eu: ['one', 'other'],
  snk: ['one', 'other'],
  pl: ['one', 'few', 'many'],
  zu: ['one', 'other'],
  ast: ['one', 'other'],
  bs: ['one', 'few', 'many'],
  'es-AR': ['one', 'other'],
  wo: ['other'],
  ti: ['one', 'other'],
  xh: ['one', 'other'],
  my: ['other'],
  'bn-IN': ['one', 'other'],
  mrj: ['one', 'other'],
  hil: ['one', 'other'],
  nr: ['one', 'other'],
  'gu-IN': ['one', 'other'],
  ann: ['one', 'other'],
  ug: ['one', 'other'],
  'hi-IN': ['one', 'other'],
  scn: ['one', 'other'],
  pai: ['other'],
  ja: ['other'],
  ks: ['one', 'other'],
  ltg: ['zero', 'one', 'other'],
  ms: ['other'],
  ml: ['one', 'other'],
  tl: ['one', 'other'],
  ceb: ['one', 'other'],
  tzm: ['one', 'other'],
  nia: ['other'],
  ckb: ['one', 'other'],
  lv: ['zero', 'one', 'other'],
  mhr: ['one', 'other'],
  kmr: ['other'],
  co: ['one', 'other'],
  xcl: ['one', 'other'],
  nyn: ['one', 'other'],
  ta: ['one', 'other'],
  ny: ['one', 'other'],
  frp: ['one', 'other'],
  bn: ['one', 'other'],
  as: ['one', 'other'],
  'zh-HK': ['other'],
  fur: ['one', 'other'],
  knn: ['one', 'other'],
  cv: ['one', 'other'],
  tok: ['other'],
  te: ['one', 'other'],
  or: ['one', 'other'],
  fa: ['one', 'other'],
  rm: ['one', 'other'],
  ilo: ['other'],
  lg: ['one', 'other'],
  ro: ['one', 'few', 'other'],
  uz: ['one', 'other'],
  lb: ['one', 'other'],
  ur: ['one', 'other'],
  arn: ['one', 'other'],
  'nb-NO': ['one', 'other'],
  vec: ['one', 'other'],
  szl: ['one', 'few', 'many'],
  'en-CA': ['one', 'other'],
  dsb: ['one', 'two', 'few', 'other'],
  hsb: ['one', 'two', 'few', 'other'],
  hu: ['one', 'other'],
  mai: ['one', 'other'],
  ia: ['one', 'other'],
  'ga-IE': ['one', 'two', 'few', 'many', 'other'],
  nv: [],
  meh: ['other'],
  mix: ['other'],
  ppl: ['one', 'other'],
  ff: ['one', 'other'],
  cak: ['one', 'other'],
  kk: ['other'],
  yo: ['one', 'other'],
  'ca-valencia': ['one', 'other'],
  jiv: ['zero', 'other'],
  mdf: ['one', 'other'],
  zam: ['one', 'other'],
  sk: ['one', 'few', 'other'],
  bo: ['other'],
  si: ['one', 'other'],
  son: ['one', 'other'],
  'fy-NL': ['one', 'other'],
  azz: ['one', 'other'],
  gd: ['one', 'two', 'few', 'other'],
  kn: ['one', 'other'],
  'sv-SE': ['one', 'other'],
  nl: ['one', 'other'],
  trs: ['one', 'other'],
  'en-GB': ['one', 'other'],
  mk: ['one', 'other'],
  sw: ['one', 'other'],
  fi: ['one', 'other'],
};

const firefoxLocales = [
  'tg',
  'kab',
  'th',
  'lo',
  'ach',
  'gl',
  'vi',
  'et',
  'hye',
  'bg',
  'hr',
  'ace',
  'ca',
  'is',
  'de',
  'ru',
  'fr',
  'ar',
  'an',
  'he',
  'br',
  'cs',
  'ixl',
  'it',
  'sl',
  'zh-TW',
  'zh-CN',
  'pt-PT',
  'es-ES',
  'hy-AM',
  'lij',
  'skr',
  'oc',
  'gv',
  'az',
  'el',
  'id',
  'pa-IN',
  'es-CL',
  'tsz',
  'lt',
  'ne-NP',
  'sr',
  'uk',
  'brx',
  'af',
  'gn',
  'cy',
  'ka',
  'eo',
  'mr',
  'es-MX',
  'crh',
  'da',
  'ko',
  'sc',
  'km',
  'nn-NO',
  'pt-BR',
  'sq',
  'be',
  'tr',
  'sat',
  'qvi',
  'quy',
  'sco',
  'eu',
  'pl',
  'ast',
  'bs',
  'es-AR',
  'wo',
  'xh',
  'my',
  'gu-IN',
  'hi-IN',
  'scn',
  'pai',
  'ja',
  'ks',
  'ltg',
  'ms',
  'ml',
  'tl',
  'ckb',
  'lv',
  'xcl',
  'ta',
  'ny',
  'frp',
  'bn',
  'as',
  'fur',
  'te',
  'or',
  'fa',
  'rm',
  'ilo',
  'lg',
  'ro',
  'uz',
  'lb',
  'ur',
  'nb-NO',
  'szl',
  'en-CA',
  'dsb',
  'hsb',
  'hu',
  'mai',
  'ia',
  'ga-IE',
  'meh',
  'mix',
  'ppl',
  'ff',
  'cak',
  'kk',
  'ca-valencia',
  'zam',
  'sk',
  'bo',
  'si',
  'son',
  'fy-NL',
  'gd',
  'kn',
  'sv-SE',
  'nl',
  'trs',
  'en-GB',
  'mk',
  'sw',
  'fi',
];

const res = {
  unsupported: {},
  pr_fewer: {},
  pr_more: {},
  mismatch: {},
  no_pontoon_many: [],
  no_pontoon_other: [],
};
for (let lc of firefoxLocales) {
  const exp = categories[lc];
  const supp = Intl.PluralRules.supportedLocalesOf(lc);
  if (supp.length > 0) {
    const pr = new Intl.PluralRules(lc);
    const pc = pr.resolvedOptions().pluralCategories;
    let ok = true;
    if (exp.length === pc.length) {
      for (let c of pc) {
        if (!exp.includes(c)) {
          ok = false;
          break;
        }
      }
    } else {
      ok = false;
    }
    if (!ok) {
      const ps = pc.sort().join(',');
      if (exp.concat('other').sort().join(',') === ps) {
        res.no_pontoon_other.push(lc);
      } else if (exp.concat('many').sort().join(',') === ps) {
        res.no_pontoon_many.push(lc);
      } else if (exp.length > pc.length) {
        res.pr_fewer[lc] = { pontoon: exp, pluralrules: pc };
      } else if (exp.length < pc.length) {
        res.pr_more[lc] = { pontoon: exp, pluralrules: pc };
      } else {
        res.mismatch[lc] = { pontoon: exp, pluralrules: pc };
      }
    }
  } else {
    res.unsupported[lc] = exp;
  }
}

console.dir(res, { depth: null });
for (let [name, obj] of Object.entries(res)) {
  console.log(name, Object.keys(obj).length);
}

export default class Parser {
  parse(cond) {
    if (cond === 'i = 0 or n = 1') return 'n >= 0 && n <= 1'
    if (cond === 'i = 0,1') return 'n >= 0 && n < 2'
    if (cond === 'i = 1 and v = 0') {
      this.v0 = 1
      return 'n == 1 && v0'
    }
    return cond
      .replace(/([tv]) (!?)= 0/g, (m, sym, noteq) => {
        const sn = sym + '0'
        this[sn] = 1
        return noteq ? '!' + sn : sn
      })
      .replace(/\b[fintv]\b/g, m => {
        this[m] = 1
        return m
      })
      .replace(/([fin]) % (10+)/g, (m, sym, num) => {
        const sn = sym + num
        this[sn] = 1
        return sn
      })
      .replace(/n10+ = 0/g, 't0 && $&')
      .replace(/(\w+ (!?)= )([0-9.]+,[0-9.,]+)/g, (m, se, noteq, x) => {
        if (m === 'n = 0,1') return '(n == 0 || n == 1)'
        if (noteq) return se + x.split(',').join(' && ' + se)
        return '(' + se + x.split(',').join(' || ' + se) + ')'
      })
      .replace(/(\w+) (!?)= ([0-9]+)\.\.([0-9]+)/g, (m, sym, noteq, x0, x1) => {
        if (Number(x0) + 1 === Number(x1)) {
          if (noteq) return `${sym} != ${x0} && ${sym} != ${x1}`
          return `(${sym} == ${x0} || ${sym} == ${x1})`
        }
        if (noteq) return `(${sym} < ${x0} || ${sym} > ${x1})`
        if (sym === 'n') {
          this.t0 = 1
          return `(t0 && n >= ${x0} && n <= ${x1})`
        }
        return `(${sym} >= ${x0} && ${sym} <= ${x1})`
      })
      .replace(/ and /g, ' && ')
      .replace(/ or /g, ' || ')
      .replace(/ = /g, ' == ')
  }

  vars() {
    let vars = []
    if (this.i) vars.push('i = s[0]')
    if (this.f || this.v) vars.push("f = s[1] || ''")
    if (this.t) vars.push("t = (s[1] || '').replace(/0+$/, '')")
    if (this.v) vars.push('v = f.length')
    if (this.v0) vars.push('v0 = !s[1]')
    if (this.t0 || this.n10 || this.n100) vars.push('t0 = Number(s[0]) == n')
    for (let k in this) {
      if (/^.10+$/.test(k)) {
        const k0 = k[0] === 'n' ? 't0 && s[0]' : k[0]
        vars.push(`${k} = ${k0}.slice(-${k.substr(2).length})`)
      }
    }
    if (!vars.length) return ''
    return 'var ' + ["s = String(n).split('.')", ...vars].join(', ')
  }
}

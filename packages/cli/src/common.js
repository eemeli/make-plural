import { source } from 'common-tags'

export const combined = {
  plurals: [
    source`
      function(n, ord) {
        if (ord) return 'other';
        return 'other';
      }
    `,
    source`
      function(n, ord) {
        if (ord) return 'other';
        return (n == 1) ? 'one' : 'other';
      }
    `,
    source`
      function(n, ord) {
        if (ord) return 'other';
        return ((n == 0
                || n == 1)) ? 'one' : 'other';
      }
    `,
    source`
      function(n, ord) {
        var s = String(n).split('.'), v0 = !s[1];
        if (ord) return 'other';
        return (n == 1 && v0) ? 'one' : 'other';
      }
    `
  ]
}

export const cardinals = {
  plurals: [
    source`
      function(n) {
        return 'other';
      }
    `,
    source`
      function(n) {
        return (n == 1) ? 'one' : 'other';
      }
    `,
    source`
      function(n) {
        return ((n == 0
                || n == 1)) ? 'one' : 'other';
      }
    `,
    source`
      function(n) {
        var s = String(n).split('.'), v0 = !s[1];
        return (n == 1 && v0) ? 'one' : 'other';
      }
    `
  ]
}

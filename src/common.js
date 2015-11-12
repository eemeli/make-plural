export const combined = {
    plurals: [
`function(n, ord) {
  if (ord) return 'other';
  return 'other';
}`,
`function(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
}`,
`function(n, ord) {
  if (ord) return 'other';
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
}`,
`function(n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return (n == 1 && v0) ? 'one' : 'other';
}`
    ],
    categories: [
        '{cardinal:["other"],ordinal:["other"]}',
        '{cardinal:["one","other"],ordinal:["other"]}',
        '{cardinal:["one","other"],ordinal:["one","other"]}',
        '{cardinal:["one","two","other"],ordinal:["other"]}'
    ]
};

export const cardinals = {
    plurals: [
`function(n) {
  return 'other';
}`,
`function(n) {
  return (n == 1) ? 'one' : 'other';
}`,
`function(n) {
  return ((n == 0
          || n == 1)) ? 'one' : 'other';
}`,
`function(n) {
  var s = String(n).split('.'), v0 = !s[1];
  return (n == 1 && v0) ? 'one' : 'other';
}`
    ],
    categories: [
        '{cardinal:["other"],ordinal:[]}',
        '{cardinal:["one","other"],ordinal:[]}',
        '{cardinal:["one","other"],ordinal:[]}',
        '{cardinal:["one","two","other"],ordinal:[]}'
    ]
};

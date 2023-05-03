import * as examples from 'make-plural/examples'

let data = []
for (let cat of ['zero', 'one', 'two', 'few', 'many', 'other']) {
  for (let { cardinal } of Object.values(examples)) {
    if (cardinal[cat]) data.push(cardinal[cat])
  }
}

const res = []
while (data.length) {
  const ex = data[0][0]
  res.push(ex)
  data = data.filter(row => !row.includes(ex))
}

res.sort((a, b) => {
  const af = a.includes('.')
  const bf = b.includes('.')
  if (af) return bf && a < b ? -1 : 1
  else return bf || Number(a) < Number(b) ? -1 : 1
})

console.log(res)

let a = [1, 2, 3, 4, 5, 6]

a.filter(b => {
  return b !== 2
})

console.log(a.filter(b => {
  console.log(b)
  return b !== 2
}))

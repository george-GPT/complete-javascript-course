// 1.1
let country = 'Canada'
let continent = 'north America'
let population = '40 Million'

console.log(country)
console.log(continent)
console.log(population)

// 1.2
const isIsland = false
let language = ''

console.log(typeof isIsland)
console.log(typeof population)
console.log(typeof country)
console.log(typeof language)

// 1.3
language = 'portuguese'
isIsland = true

// 1.4
halfA = country / 2
halfB = country / 2

country = halfA + halfB
console.log(population)
population += 1

let finlandPop = 6000000
if (finlandPop > population) {
  console.log('Finland has a greater population')
}

averapgePop = 33000000
if (population < averapgePop) {
  console.log('Canada is low pop')
}

let description =
  country +
  'is in' +
  continent +
  'and its' +
  population +
  'people speak' +
  language
console.log(description)

// 1.4
let description = `${country} + "is in" + ${continent} + "and its + ${population} "people speak" + ${language}`

// 1.5
let belowAverage = averagePop - population

if (population > 33000000) {
  console.log(`${country}'s population is ${belowAverage} below average`)
}

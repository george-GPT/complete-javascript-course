// Remember, we're gonna use strict mode in all scripts now!
'use strict'

function printForecast(arr) {
  let days = 0
  for (let i = 0; i < arr.length; i++) {
    days++
    console.log(`${arr[i]}°C in ${days} days`)
  }
}

const dataOne = [17, 21, 23]
const dataTwo = [12, 5, -5, 0, 4]

printForecast(dataOne)
printForecast(dataTwo)

// transform array into string
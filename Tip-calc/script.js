// dom references
const bill = document.getElementById('bill')
const tip = document.getElementById('tip')
const tax = document.getElementById('tax')
const total = document.getElementById('total')
const calculateButton = document.getElementById('calculate')
const resetButton = document.getElementById('reset')

// initializations (separate internal values than dom values)
let billAmount = ''
let taxAmount = ''
let tipAmount = ''
let totalAmount = ''
resetButton.disabled = true

if (bill.value !== '') {
  calculateButton.disabled = false
} else {
  calculateButton.disabled = true
}

function billCalculation() {
  billAmount = parseFloat(bill.value)
  if (isNaN(billAmount)) {
    alert('Please enter a valid number.')
  } else {
    taxAmount = billAmount * 0.13
    tax.innerText = taxAmount.toFixed(2)
    tipAmount = (billAmount + taxAmount) * 0.18
    tip.innerText = tipAmount.toFixed(2)
    totalAmount = billAmount + taxAmount + tipAmount
    total.innerText = totalAmount.toFixed(2)
    resetButton.disabled = false
  }
}

function resetCalc() {
  bill.value = ''
  tax.value = ''
  tip.value = ''
  total.value = ''
  resetButton.disabled = true
  calculateButton.disabled = true
}

calculateButton.addEventListener('click', billCalculation)
resetButton.addEventListener('click', resetCalc)

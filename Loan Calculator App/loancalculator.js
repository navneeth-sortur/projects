// DOM Elements
const amountInput = document.getElementById("amount");
const interestInput = document.getElementById("interest_rate");
const monthsInput = document.getElementById("months");
const calculateBtn = document.getElementById("calculateBtn");
const resultsDiv = document.getElementById("results");
const monthlyPaymentEl = document.getElementById("monthlyPayment");
const totalPaymentEl = document.getElementById("totalPayment");
const totalInterestEl = document.getElementById("totalInterest");

amountInput.addEventListener("input", e => {
  // Remove all non-digit characters
  let input = e.target.value.replace(/\D/g, "");

  // Format with commas as per Indian numbering system
  if (input.length > 0) {
    let lastThree = input.substring(input.length - 3);
    let otherNumbers = input.substring(0, input.length - 3);

    if (otherNumbers !== "") {
      lastThree = "," + lastThree;
    }

    let formatted =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    e.target.value = formatted;
  }
});

// Convert formatted value back to number for calculations
const parseFormattedNumber = formattedValue => {
  return parseInt(formattedValue.replace(/,/g, ""), 10);
};

// Format currency
const formatCurrency = amount => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(amount);
};

const calculateLoan = () => {
  // Get input values with destructuring
  const principal = parseFormattedNumber(amountInput.value);
  const interestRate = parseFloat(interestInput.value) / 100 / 12;
  const numberOfPayments = parseInt(monthsInput.value);

  // Input validation
  if (
    isNaN(principal) ||
    isNaN(interestRate) ||
    isNaN(numberOfPayments) ||
    principal <= 0 ||
    interestRate <= 0 ||
    numberOfPayments <= 0
  ) {
    alert("Please enter valid positive numbers for all fields");
    return;
  }

  // Calculate monthly payment using the formula:
  // P = (r*PV) / (1 - (1 + r)^(-n))
  const x = Math.pow(1 + interestRate, numberOfPayments);
  const monthlyPayment = (principal * interestRate * x) / (x - 1);

  // Calculate total values
  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - principal;

  // Update UI with template literals
  monthlyPaymentEl.textContent = formatCurrency(monthlyPayment);
  totalPaymentEl.textContent = formatCurrency(totalPayment);
  totalInterestEl.textContent = formatCurrency(totalInterest);

  resultsDiv.classList.add("visible");
};

calculateBtn.addEventListener("click", e => {
  e.preventDefault();
  calculateLoan();
});

[amountInput, interestInput, monthsInput].forEach(input => {
  input.addEventListener("input", () => {
    if (resultsDiv.classList.contains("visible")) {
      resultsDiv.classList.remove("visible");
    }
  });
});

// DOM Elements
const balanceElement = document.getElementById("balance");
const moneyPlusElement = document.getElementById("money-plus");
const moneyMinusElement = document.getElementById("money-minus");
const listElement = document.getElementById("list");
const formElement = document.getElementById("form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const clearAllButton = document.getElementById("clear-all");
const dateTimeElement = document.getElementById("current-date-time");
const toggleOptions = document.querySelectorAll(".toggle-option");

// Initialize transactions from localStorage or empty array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let transactionType = "income"; // Default to income
let editingTransactionId = null;

// Update date and time
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };
  dateTimeElement.textContent = now.toLocaleDateString("en-US", options);
}

// Update date time immediately and set interval to update every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Format currency with commas
function formatCurrency(amount) {
  return (
    "₹" +
    Math.abs(amount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
  );
}

// Parse currency input
function parseCurrencyInput(value) {
  return parseFloat(value.replace(/,/g, ""));
}

// Format input with commas as user types
function formatInputWithCommas(input) {
  // Remove non-digit characters
  let value = input.value.replace(/\D/g, "");

  // Format with commas
  if (value.length > 0) {
    value = parseFloat(value).toLocaleString("en-IN");
  }

  // Update input value
  input.value = value;
}

// Toggle transaction type
function toggleTransactionType(type) {
  transactionType = type;
  toggleOptions.forEach(option => {
    if (option.dataset.type === type) {
      option.classList.add("active");
    } else {
      option.classList.remove("active");
    }
  });
}

// Add transaction to DOM
function addTransactionDOM(transaction) {
  // Remove empty state if it exists
  const emptyState = listElement.querySelector(".empty-state");
  if (emptyState) {
    listElement.removeChild(emptyState);
  }

  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add("transaction-item");
  item.classList.add(transaction.amount < 0 ? "expense" : "income");
  item.setAttribute("data-id", transaction.id);

  item.innerHTML = `
          <span class="transaction-text">${transaction.text}</span>
          <span class="transaction-amount">${sign}${formatCurrency(
    transaction.amount
  )}</span>
          <div class="transaction-actions">
            <button class="action-btn edit-btn" onclick="startEditTransaction(${
              transaction.id
            })">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" onclick="removeTransaction(${
              transaction.id
            })">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;

  listElement.appendChild(item);
}

// Update balance, income, and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balanceElement.innerText = formatCurrency(total);
  moneyPlusElement.innerText = formatCurrency(income);
  moneyMinusElement.innerText = formatCurrency(expense);
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Start editing a transaction
function startEditTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  if (!transaction) return;

  // Set editing mode
  editingTransactionId = id;

  // Find the transaction item in DOM
  const transactionItem = document.querySelector(
    `.transaction-item[data-id="${id}"]`
  );

  // Create edit form
  const isIncome = transaction.amount > 0;
  const editForm = document.createElement("div");
  editForm.classList.add("edit-form");
  editForm.innerHTML = `
          <input type="text" class="edit-form-input edit-text" value="${
            transaction.text
          }" placeholder="Description">
          <input type="text" class="edit-form-input edit-amount" value="${Math.abs(
            transaction.amount
          )}" placeholder="Amount">
          <div class="edit-form-actions">
            <button type="button" class="edit-form-btn save" onclick="saveEditTransaction(${id})">Save</button>
            <button type="button" class="edit-form-btn cancel" onclick="cancelEditTransaction()">Cancel</button>
          </div>
        `;

  // Replace transaction content with edit form
  transactionItem.innerHTML = "";
  transactionItem.appendChild(editForm);

  // Format amount input with commas
  const amountInput = editForm.querySelector(".edit-amount");
  formatInputWithCommas(amountInput);

  // Add event listener for formatting
  amountInput.addEventListener("input", function () {
    formatInputWithCommas(this);
  });
}

// Save edited transaction
function saveEditTransaction(id) {
  const transactionItem = document.querySelector(
    `.transaction-item[data-id="${id}"]`
  );
  const textInput = transactionItem.querySelector(".edit-text");
  const amountInput = transactionItem.querySelector(".edit-amount");

  // Validate inputs
  if (textInput.value.trim() === "") {
    alert("Please enter a description");
    return;
  }

  if (
    amountInput.value.trim() === "" ||
    parseCurrencyInput(amountInput.value) === 0
  ) {
    alert("Please enter a valid amount");
    return;
  }

  // Update transaction
  const transactionIndex = transactions.findIndex(t => t.id === id);
  if (transactionIndex !== -1) {
    // Determine sign based on original transaction type
    const originalAmount = transactions[transactionIndex].amount;
    const sign = originalAmount < 0 ? -1 : 1;

    transactions[transactionIndex].text = textInput.value;
    transactions[transactionIndex].amount =
      sign * parseCurrencyInput(amountInput.value);
  }

  // Exit editing mode
  editingTransactionId = null;

  // Update storage and re-render
  updateLocalStorage();
  init();
}

// Cancel editing
function cancelEditTransaction() {
  editingTransactionId = null;
  init();
}

// Clear all transactions
function clearAllTransactions() {
  if (transactions.length === 0) return;

  if (confirm("Are you sure you want to delete all transactions?")) {
    transactions = [];
    updateLocalStorage();
    init();
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add new transaction
function addTransaction(e) {
  e.preventDefault();

  // Reset error states
  document.querySelectorAll(".form-control").forEach(control => {
    control.classList.remove("error");
  });

  let hasError = false;

  if (textInput.value.trim() === "") {
    textInput.parentElement.classList.add("error");
    hasError = true;
  }

  if (
    amountInput.value.trim() === "" ||
    parseCurrencyInput(amountInput.value) === 0
  ) {
    amountInput.parentElement.classList.add("error");
    hasError = true;
  }

  if (hasError) return;

  const sign = transactionType === "income" ? 1 : -1;
  const transaction = {
    id: generateID(),
    text: textInput.value,
    amount: sign * parseCurrencyInput(amountInput.value)
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  // Reset form
  textInput.value = "";
  amountInput.value = "";
  toggleTransactionType("income"); // Reset to income
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize app
function init() {
  listElement.innerHTML = "";

  if (transactions.length === 0) {
    listElement.innerHTML = `
            <li class="empty-state">
              <i class="fas fa-receipt"></i>
              <p>No transactions yet</p>
            </li>
          `;
  } else {
    transactions.forEach(addTransactionDOM);
  }

  updateValues();
}

// Event listeners
formElement.addEventListener("submit", addTransaction);
clearAllButton.addEventListener("click", clearAllTransactions);

// Toggle option event listeners
toggleOptions.forEach(option => {
  option.addEventListener("click", () => {
    toggleTransactionType(option.dataset.type);
  });
});

// Input validation
textInput.addEventListener("input", () => {
  if (textInput.value.trim() !== "") {
    textInput.parentElement.classList.remove("error");
  }
});

amountInput.addEventListener("input", function () {
  formatInputWithCommas(this);
  if (this.value.trim() !== "" && parseCurrencyInput(this.value) !== 0) {
    this.parentElement.classList.remove("error");
  }
});

// Initialize the app
init();

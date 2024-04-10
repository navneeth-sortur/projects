const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions = localStorageTransactions || [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  const textValue = text.value.trim();
  const amountValue = amount.value.trim();

  if (textValue === "" || amountValue === "") {
    alert("Please add some text and amount ");
  } else {
    const transaction = {
      id: generateID(),
      text: textValue,
      amount: +amountValue
    };
    transactions.push(transaction);
    updateTransactionsDOM();
    updateValues();
    updateLocalStorage();
    text.value = "";
    amount.value = "";
  }
}

// Generate a 8-digit random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Update transactions in DOM
function updateTransactionsDOM() {
  const transactionElements = transactions.map(transaction => {
    const sign = transaction.amount < 0 ? "-" : "+";
    return `
    <li class="${transaction.amount < 0 ? "minus" : "plus"}">
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class=delete-btn onclick="removeTransaction(${
      transaction.id
    })"> X </button>
    </li>
    `;
  });

  list.innerHTML = transactionElements.join("");
}

// Update the balance, income and expense values
function updateValues() {
  const { total, income, expense } = transactions.reduce(
    (acc, transaction) => {
      let amt = transaction.amount;
      acc.total += amt;
      if (amt > 0) acc.income += amt;
      else acc.expense += amt;

      return acc;
    },
    { total: 0, income: 0, expense: 0 }
  );

  // balance.innerText = `&#x8377;${total}`;
  // money_plus.innerText = `&#x8377;${income}`;
  // money_minus.innerText = `&#x8377;${expense}`;

  balance.innerHTML = `&#x20B9;${total}`;
  money_minus.innerHTML = `&#x20B9;${expense}`;
  money_plus.innerHTML = `&#x20B9;${income}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  updateTransactionsDOM();
  updateValues();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize
updateTransactionsDOM();
updateValues();

// Event Listeners.
form.addEventListener("submit", addTransaction);

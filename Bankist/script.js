"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Learning APP

// Data
const account1 = {
  owner: "Samrose Mohammed",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Ram Bahadur",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Hari Bahadur",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Laxman K.C",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// BANKIST APP
////////////////////////////////////////////////
const createUserName = function (accs) {
  accs.forEach(function (accMove) {
    accMove.username = accMove.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);
console.log(accounts);

const displayMovements = function (movement, sort = false) {
  containerMovements.innerHTML = " ";

  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;
  movs.forEach(function (move, i) {
    const type = move > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i} ${type}</div>
      <div class="movements__value">${move}€</div>
    </div>
    `;

    // add element by appending mean first value at at display
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// call function to works
// displayMovements(account1.movements);

const displayAmountSummary = function (acc) {
  const amountIn = acc.movements
    .filter((move) => move > 0)
    .reduce((acc, curr) => acc + curr, 0);
  console.log(amountIn);
  labelSumIn.innerHTML = `${amountIn}€`;

  const amountOut = acc.movements
    .filter((move) => move < 0)
    .reduce((acc, curr) => acc + curr, 0);
  console.log(amountOut);
  labelSumOut.textContent = `${Math.abs(amountOut)}€`;

  const interestDeposit = acc.movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((allowInt, index, array) => {
      // console.log(array);
      return allowInt >= 1;
    })
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interestDeposit}€`;
};
// displayAmountSummary(account1.movements);

const printAmount = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr, i) => acc + curr, 0);
  labelBalance.innerHTML = acc.balance + "€";
};
// call function to printAmount
// printAmount(account1.movements);

const updateUi = function (currentAcc) {
  // display current object data
  displayMovements(currentAcc.movements);

  // display current object amount sumary
  displayAmountSummary(currentAcc);

  // display current object total amount
  printAmount(currentAcc);
};

/////////////////////////////////////
/* Implementing the login logic */
////////////////////////////////////
let currentAcc;
btnLogin.addEventListener("click", function (e) {
  // prevent default reload
  e.preventDefault();
  console.log("LOGIN");

  currentAcc = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAcc);

  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    // display user name
    labelWelcome.textContent = `Welcom back, ${currentAcc.owner.split(" ")[0]}`;
    // display ui
    containerApp.style.opacity = 100;
    containerApp.style.visibility = "visible";
    containerApp.style.pointerEvents = "auto";

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update UI
    updateUi(currentAcc);
  } else {
    alert(`
    Please Enter correct username or pin`);
  }
});
console.log(accounts);

//////////////////////////////////////////
/* Implementing the TansferMoney logic */
/////////////////////////////////////////
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  console.log(amount, receiver);

  // clear the content
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiver &&
    receiver?.username !== currentAcc.username &&
    amount <= currentAcc.balance
  ) {
    currentAcc.movements.push(-amount);
    receiver.movements.push(amount);
    // update UI
    updateUi(currentAcc);
  } else {
    alert(`
    1. Amount > 0
    2. Not allow to transfer in own acc
    3. Amount <= Total Amount
    `);
  }
});

//////////////////////////////////////////
/* Implementing the LoanReaquest logic */
/////////////////////////////////////////
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Loan");
  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAcc.movements.some((move) => move >= loanAmount / 10)
  ) {
    currentAcc.movements.push(loanAmount);
    inputLoanAmount.value = "";
    updateUi(currentAcc);
  } else {
    alert(`
    1. Access Loan only when 10% of maximum Deposit ✅
    2. Amount > 0`);
  }
});

//////////////////////////////////////////
/* Implementing the Close Acc logic */
/////////////////////////////////////////
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAcc?.username === inputCloseUsername.value &&
    currentAcc?.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAcc.username
    );

    // delect account using splice method
    accounts.splice(index, 1);

    // logout
    containerApp.style.opacity = 0;

    console.log(index);
    // alert("Account Closed !!");
    console.log("Delete");
  } else {
    alert("Enter correct username or pin !!");
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

//////////////////////////////////////////
/* Implementing the Sort logic */
/////////////////////////////////////////
let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAcc.movements, !sorted);
  sorted = !sorted;
});

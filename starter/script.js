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

/////////////////////////////////////////////////
// LECTURES
/////////////////////////////////////////////////
// let arr = ["a", "b", "c", "d", "e", "f"];

// /* SLICE METHOD */
// // slice method same method in string
// // slice method create a sallow copy of original array
// // means it doesn't mutate the original array
// console.log(arr.slice(1)); // start index 1
// console.log(arr.slice(2));
// console.log(arr.slice(-1));
// console.log(arr.slice(-2));
// console.log(arr.slice(2, -1)); // start 2 but end at -1 without including -1 element

// /* SPLICE METHOD */
// // similar as slice method but it mutate the original array
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// /* REVERSE METHOD */
// // it mutate the original array;
// arr = ["j", "i", "g", "f", "e"];
// arr.reverse(arr);
// console.log(arr);

// /* CONCAT METHOD */
// let arr2 = ["a", "b", "c", "d"];
// console.log(arr.concat(arr2)); // merge the two array

// /* JOIN METHOD */
// console.log(arr.join(" + ") + " = efgij");

// /* PUSH, UNSHIFT, POP, SHIFT, INDEXOF, INCLUDES METHOD */
// arr.push("aa"); // add element at the end
// console.log(arr);
// arr.unshift("aaa"); // add element at the first
// console.log(arr);
// arr.pop("aa"); // remove the element at last
// console.log(arr);
// arr.shift("aaa"); // remove the element at first
// console.log(arr);
// console.log(arr.indexOf("e")); // return the index of element
// console.log(arr.includes("r")); // return boolean

// /* New at method (use () not [])*/
// const array = [1, 2, 3, 5, 6, 8];

// // traditional way to access element
// console.log(array[0]);
// console.log(array[array.length - 1]);
// console.log(array.slice(-1)[0]);

// // Modern way
// console.log(array.at(-1));
// const string = "Hello World";
// console.log(string.at(-1)); // also works on string

/////////////////////////////////////////////////
// FOR EACH LOOP

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // console.log(Object.entries(movements));
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Moment ${i + 1} You have deposited ${movement} amounts`);
//   } else {
//     console.log(
//       `Moment ${i + 1} You have withdraw ${Math.abs(movement)} amounts`
//     );
//   }
// }
// console.log("---- FOR EACH ----");

// /* FOR EACH LOOP */
// movements.forEach(function (mov, i, array) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1} You have deposited ${mov} amounts`);
//   } else {
//     console.log(`Movement ${i + 1} You have withdraw ${Math.abs(mov)} amounts`);
//   }
// });

// /////////////////////////////////////////////////

// /* MAP FOR EACH */
// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// // console.log(currencies.entries());
// currencies.forEach(function (countryName, currency, currencies) {
//   console.log(`${currency} : ${countryName}`);
// });

// /* SET FOR EACH */
// // set doesn't have key as well as index
// const currency2 = new Set(["USD", "EUR", "GBP"]);
// currency2.forEach(function (currencies, _, currency2) {
//   console.log(`${currencies} : ${currencies}`);
// });

/* Map Method */
// const eurToUsd = 1.1;
// const movementsUsd = movements.map((move) => {
//   return move * eurToUsd;
// });
// console.log(movements);
// console.log(movementsUsd);

// const movementForOf = [];
// for (const move of movements) {
//   movementForOf.push(move * eurToUsd);
// }
// console.log("for of loop ⬇");
// console.log(movementForOf);

// const movementDescription = movements.map((mov, i) => {
//   return `Movement ${i + 1} You have ${
//     mov > 0 ? "deposit" : "withdrawal"
//   } ${mov} amounts`;
// });
// console.log(movementDescription);

// /* Computing Username */
const name = "Mohammed Samrose";
const nameArray = name.toLowerCase().split(" ");
console.log(nameArray);
const firstLetter = nameArray.map((move) => move[0]);

console.log(firstLetter.join(""));

// /* FILTER METHOD */
// const deposit = function (arr) {
//   return arr.filter((move) => move > 0);
// };

// const withdrawal = function (arr) {
//   return arr.filter((move) => move > 0);
// };

// console.log(deposit(movements));
// console.log(withdrawal(movements));

// /* for each loop */
// const depositsFor = [];
// for (const move of movements) {
//   if (move > 0) {
//     depositsFor.push(move);
//   }
// }

// const withdrawFor = [];
// for (const amount of movements) {
//   if (amount < 0) {
//     withdrawFor.push(amount);
//   }
// }
// console.log(withdrawFor);

// /* Reduce Method */
// const totalAmount = movements.reduce((acc, currentValue, index) => {
//   console.log(`Current acc ${index} ${acc}`);
//   return acc + currentValue;
// }, 0);
// console.log(totalAmount);

// // for maximum
// const maximumNum = movements.reduce((acc, curr, i) => {
//   if (acc < curr) {
//     acc = curr;
//   }
//   return acc;
// }, 0);

// const minimum = movements.reduce((acc, curr, i) => {
//   if (acc > curr) {
//     acc = curr;
//   }

//   return acc;
// }, movements[0]);
// console.log(minimum);

// console.log(maximumNum);

// /* for loop as condition */
// let balance = 0;
// for (const move of movements) {
//   balance += move;
//   console.log("for loop " + balance);
// }

// /* The Magic of Chaining Method */
// const chainValue = movements
//   .filter((mov) => mov > 0)
//   .map((mov) => mov * eurToUsd)
//   .reduce((acc, curr) => acc + curr, 0);
// console.log(chainValue);

/* FIND METHOD */
// const findNumber = movements.find((move) => move < 0);
// console.log(movements);
// console.log(findNumber);

// const findObject = accounts.find((acc) => acc.owner === "Jessica Davis");
// console.log(findObject);

// // same doing for loop
// for (const object of accounts) {
//   if (object.owner === "Jessica Davis") {
//     console.log(object);
//     break;
//   }
// }
// for (const number of movements) {
//   if (number < 0) {
//     console.log(number);
//     break;
//   }
// }

/* SOME METHOD */

// EQUALITY
console.log(movements.includes(-130));

// SOME METHOD (CHECK CONDTION)
const check = movements.some((value) => value > 0);
console.log(movements.some((value) => value === -130));
console.log(check);

// EVERY METHOD
const checkEvery = movements.every((value) => value > 0);
console.log(account4.movements.every((value) => value > 0));
console.log(checkEvery);

/* FLAT METHOD */
const arr = [[1, 2], [2, 3, 4], 4, [3]];
console.log(arr.flat()); // goes 1 level deep

const arrDeep = [[1, 2, [2, 3]], [3, [3, 4]], 3, 4];
console.log(arrDeep.flat(2));

const arrDeep2 = [[1, 2, [2, 3, [3, 3]]], [1, [1, , 2, [(2, 3)]]], 3, 4];
console.log(arrDeep2.flat(3));

// taking out the array from nested object;
const accMovement = accounts.map((acc) => acc.movements);
console.log(accMovement);

const accFlat = accMovement.flat();
console.log(accFlat);

const accReduce = accFlat.reduce((acc, value) => acc + value, 0);
console.log(accReduce);

// Now same (chaining method)
const allReduce = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, value) => acc + value, 0);
console.log(allReduce);

// flatMap method
const allMap = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, value) => acc + value, 0);
console.log(allMap);

/* SORT METHOD */

// sort method work on the basis of string
// const sortStr = ["james", "bond", "nick"];
// console.log(sortStr.sort());

// // doesn't work properply
// const sortArr = movements.sort();
// console.log(sortArr);

// // using anther way
// movements.sort((a, b) => {
//   if (a > b) {
//     return 1;
//   }
//   if (a < b) {
//     return -1;
//   }
// });
// console.log(movements);
// movements.sort((a, b) => {
//   if (a > b) {
//     return -1;
//   }
//   if (a < b) {
//     return 1;
//   }
// });
// console.log(movements);

// // another way
// // for ascending order
// movements.sort((a, b) => a - b);
// console.log(movements);

// // for descending order
// movements.sort((a, b) => b - a);
// console.log(movements);

/////////////////////////////////////////////////
// Creating and filling Arrays
/////////////////////////////////////////////////
const arrs = [2, 4, 5, 8, 9, 10]; // manually
console.log([3, 4, 5, 9]);
console.log(arrs);

const x = new Array(7);
console.log(x);
// x.map(() => 6); not work
console.log(x);

/* fill method */
// x.fill(1); // fill 1 in all element
x.fill(1, 3); // 3 start index
x.fill(23, 2, 4); // 23 from index 2 and end at 4
console.log(x);

// can be used in normal array
arrs.fill(20, 3, 5);
console.log(arrs);

/* Array Form */
const y = Array.from({ length: 7 }, () => 5);
console.log(y);

const z = Array.from({ length: 5 }, (_, index) => index + 1);
console.log(z);

// conveting querySelectorAll to Array
labelBalance.addEventListener("click", () => {
  const movementUi = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => Number(el.textContent.replace("€", ""))
  );
  console.log(movementUi);
});

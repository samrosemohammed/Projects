// // challenge 1
// const checkDogs = function (juliaData, kataData) {
//   const shallowCopy = juliaData.slice(1, -2);

//   const combinedDogData = [...shallowCopy, ...kataData];

//   combinedDogData.forEach(function (age, i) {
//     const type = age >= 3 ? "adult" : "puppy";
//     if (type === "adult") {
//       console.log(`Dog number ${i + 1} is ${type}, and is ${age} year's old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a ${type} 🐶`);
//     }
//   });

//   console.log(juliaData);
//   console.log(shallowCopy);
//   console.log(combinedDogData);
// };

// const dataJulia = [3, 5, 2, 12, 7];
// const dataKate = [4, 1, 15, 8, 3];
// const dataJulia2 = [9, 16, 6, 8, 3];
// const dataKate2 = [10, 5, 6, 1, 4];

// checkDogs(dataJulia, dataKate);
// console.log("---- FOR DATA ----");
// checkDogs(dataJulia2, dataKate2);

// challenge 2
const testData = [5, 2, 4, 1, 15, 8, 3];
// const testData2 = [2, 4, 5, 8, 9, 2, 19, 12];
// const calAverageHumanAge = function (movements) {
//   const humanAge = movements.map((age) => (age <= 2 ? age * 2 : 16 + age * 4));
//   console.log(humanAge);

//   const adult = humanAge.filter((age) => age >= 18);
//   console.log(adult);

//   const avgAge =
//     humanAge.reduce((acc, age, i, array) => acc + age, 0) / adult.length;
//   console.log(avgAge);
// };

// calAverageHumanAge(testData);

// challenge 3
// const calAverageHumanAge = (age) =>
//   age
//     .map((age) => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter((age) => age >= 18)
//     .reduce((acc, age, i, array) => acc + age / array.length, 0);
// console.log(calAverageHumanAge(testData));

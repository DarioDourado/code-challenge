/* Provide 3 unique implementations of the following function in JavaScript.
 Input: n - any integer
 Assuming this input will always produce a result lesser than Number.MAX_SAFE_INTEGER.
 Output: return - summation to n, i.e. sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15.
 */

// 1 - Using a Loop, choose a for loop, however it could be solved with a forEach as well
var sum_to_n_a = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// 2 - Using the Math Formula (The simplest Way)
var sum_to_n_b = function (n) {
  return (n * (n + 1)) / 2;
};

// 3 - Using and Array Reduce
var sum_to_n_c = function (n) {
  let sum = 0;
  Array.from({ length: n }, (_, i) => i + 1).forEach((num) => {
    sum += num;
  });
  return sum;
};

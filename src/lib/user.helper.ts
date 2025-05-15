/**
 * This file contains helper functions for user-related operations.
 */

export function generateSixRandomNumbers(): number[] {
  const numbers: number[] = [];
  for (let i = 0; i < 6; i++) {
    numbers.push(Math.floor(Math.random() * 10)); // Generates numbers between 0 and 99
    // console.log(numbers);
  }
  return numbers;
}

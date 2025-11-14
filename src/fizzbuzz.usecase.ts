export function fizzbuzz(n: number): string {
  const isMultipleOfThree = n % 3 === 0;
  const isMultipleOfFive = n % 5 === 0;
  const isMultipleOfThreeAndFive = isMultipleOfThree && isMultipleOfFive;

  if (isMultipleOfThreeAndFive) {
    return "FizzBuzz";
  }
  if (isMultipleOfThree) {
    return "Fizz";
  }
  if (isMultipleOfFive) {
    return "Buzz";
  }
 
  return n.toString();
}

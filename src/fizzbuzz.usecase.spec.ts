import { describe, expect, it } from "vitest";
import { fizzbuzz } from "./fizzbuzz.usecase";

describe("fizzbuzz", () => {
  it.each([
    [1, "1"],
    [2, "2"],
    [3, "Fizz"],
    [4, "4"],
    [5, "Buzz"],
    [6, "Fizz"],
    [7, "7"],
    [8, "8"],
    [9, "Fizz"],
    [10, "Buzz"],
    [11, "11"],
    [12, "Fizz"],
    [13, "13"],
    [14, "14"],
    [15, "FizzBuzz"],
  ])("when input is %s should be return %s ", (input, expected) => {
    // Act
    const result = fizzbuzz(input);

    // Assert
    expect(result).toBe(expected);
  });
});

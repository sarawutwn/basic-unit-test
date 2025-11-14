import { describe, expect, it } from "vitest";
import { SignInUseCase } from "./sign-in.usecase";
import { mock } from "vitest-mock-extended";
import type { IUsersRepository } from "./ports/users.repository";
import type { IUser } from "./domain/users.domain";
import { Builder } from "builder-pattern";

describe("SignInUseCase", () => {
  const userRepository = mock<IUsersRepository>();
  const signInUseCase = new SignInUseCase(userRepository);

  describe("getUserByEmail", () => {
    const email = "test@example.com";
    it("should throw an error if the user is not found", async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      const expectedError = new Error("ไม่พบผู้ใช้งาน");

      // Act
      const actual = signInUseCase.getUserByEmail(email);

      // Assert
      await expect(actual).rejects.toThrow(expectedError);
    });

    it("should return the user if the user is found", async () => {
      // Arrange
      const expectedUser = Builder<IUser>().email(email).build();
      userRepository.findByEmail.mockResolvedValue(expectedUser);

      // Act
      const actual = signInUseCase.getUserByEmail(email);

      // Assert
      await expect(actual).resolves.toBe(expectedUser);
    });
  });

  describe("checkUserIsActive", () => {
    it("should throw an error if the user is not active", async () => {
      // Arrange
      const users = Builder<IUser>().status(false).build();
      const expectedError = new Error("ผู้ใช้งานถูกปิดการใช้งาน");

      // Act
      const actual = signInUseCase.checkUserIsActive(users);

      // Assert
      await expect(actual).rejects.toThrow(expectedError);
    });

    it("should not throw an error if the user is active", async () => {
      // Arrange
      const users = Builder<IUser>().status(true).build();
      // Act
      const actual = signInUseCase.checkUserIsActive(users);
      // Assert
      await expect(actual).resolves.not.toThrow();
    });
  });


});

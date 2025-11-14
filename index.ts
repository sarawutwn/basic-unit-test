import { UsersDrizzleRepository } from "./src/adapters/users.drizzle.repository";
import { UserMongoDBRepository } from "./src/adapters/users.mongodb.repository";
import { fizzbuzz } from "./src/fizzbuzz.usecase";
import { SignInUseCase } from "./src/sign-in.usecase";

console.log(
  Array.from({ length: 100 })
    .map((_, index) => fizzbuzz(index + 1))
    .join("\n")
);

// const usersRepository = new UsersDrizzleRepository();
const usersRepository = new UserMongoDBRepository();
const signInUseCase = new SignInUseCase(usersRepository);

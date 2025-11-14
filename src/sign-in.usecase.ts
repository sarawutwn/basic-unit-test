import type { IUser } from "./domain/users.domain";
import type { IUsersRepository } from "./ports/users.repository";

export class SignInUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(email: string, password: string): Promise<void> {
    // GET Users By Email
    const user = await this.getUserByEmail(email);
    // Check user is not block
    await this.checkUserIsActive(user);
    // Check password is correct
    // create token
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new Error("ไม่พบผู้ใช้งาน");
    }
    return user;
  }

  async checkUserIsActive(user: IUser): Promise<void> {
    if (!user.status) {
      throw new Error("ผู้ใช้งานถูกปิดการใช้งาน");
    }
  }

  async checkPasswordIsCorrect(user: IUser, password: string): Promise<void> {}

  async createToken(user: IUser): Promise<string> {
    return "";
  }
}

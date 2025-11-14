import type { IUser } from "../domain/users.domain";
import type { IUsersRepository } from "../ports/users.repository";

export class UsersDrizzleRepository implements IUsersRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return null;
  }

  async getById(id: string): Promise<IUser | null> {
    return null;
  }

  async getAll(): Promise<IUser[]> {
    return [];
  }
}

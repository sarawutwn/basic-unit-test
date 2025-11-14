import type { IUser } from "../domain/users.domain";

export interface IUsersRepository {
    findByEmail(email: string): Promise<IUser | null>;
    getById(id: string): Promise<IUser | null>;
    getAll(): Promise<IUser[]>;
}
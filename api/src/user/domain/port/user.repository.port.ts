import { User } from "../entity/user";
import { Role } from "../valueobject/role";

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepositoryPort {
    saveUser(user: User): Promise<User>;
    findUserById(id: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    updateUser(user: User): Promise<User>;
    deleteUser(id: string): Promise<void>;
    findByRole(role: Role): Promise<User[]>;
}
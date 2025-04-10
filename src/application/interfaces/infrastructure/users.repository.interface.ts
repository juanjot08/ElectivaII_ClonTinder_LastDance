import { User } from "../../../domain/entities/user";

export interface IUsersRepository {
    getUser(id: Number): Promise<User | null>;
}
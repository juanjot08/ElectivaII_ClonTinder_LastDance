import { User } from "../../../domain/entities/user";

export interface IUsersService {
    getUser(id: Number): Promise<User | null>
}
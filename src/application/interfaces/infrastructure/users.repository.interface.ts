import { User } from "../../../domain/entities/user";
import { UpdateUserDTO } from "../../../presentation/tinder-api/dtos/updateuser.dto";

export interface IUsersRepository {
    getUser(id: Number): Promise<User | null>;
    postUser(user: User): Promise<User | null>;
    updateUser(id: Number, updateUserDto: UpdateUserDTO): Promise<User | null>;
    deleteUser(id: Number): Promise<boolean>;
    getUsers(): Promise<User[]>;
}
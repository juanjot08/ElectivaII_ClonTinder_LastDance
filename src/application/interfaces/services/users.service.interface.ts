import { User } from "../../../domain/entities/user";
import { UpdateUserDTO } from "../../../presentation/tinder-api/dtos/updateuser.dto";

export interface IUsersService {
    getUser(id: Number): Promise<User | null>
    postUser(user: User): Promise<User | null>
    updateUser(id:Number, userUpdateDto: UpdateUserDTO): Promise<User | null>
    deleteUser(id: Number): Promise<Boolean>
    getUsers(): Promise<User[]>

}
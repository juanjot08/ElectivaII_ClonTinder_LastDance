import { User } from "../../../domain/entities/user";
import { UpdateUserDTO } from "../dtos/users/serviceRequest/updateuser.dto";

export interface IUsersRepository {
    getUser(id: bigint): Promise<User | null>;

		getUserByIdentityId(identityId: bigint): Promise<User | null>;
    
		createUser(user: User): Promise<User | null>;
    
		updateUser(id: bigint, updateUserDto: UpdateUserDTO): Promise<User | null>;
    
		deleteUser(id: bigint): Promise<boolean>;
    
		getUsers(): Promise<User[]>;
}
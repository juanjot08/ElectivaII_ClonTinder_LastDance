import { User } from "../../../domain/entities/user";
import { FindPotentialMatchesResult } from "../dtos/users/repositoryResponse/potentialMatches.response";
import { UpdateUserDTO } from "../dtos/users/serviceRequest/updateuser.dto";

export interface IUsersRepository {
    getUser(id: bigint): Promise<User | null>;

		getUserByIdentityId(identityId: bigint): Promise<User | null>;
    
		createUser(user: User): Promise<User | null>;
    
		updateUser(id: bigint, updateUserDto: any): Promise<User | null>;
    
		deleteUser(id: bigint): Promise<boolean>;
    
		getUsers(): Promise<User[]>;

		getPotentialMatches(user: User, excludedIds: bigint[], limit: number, lastId?: bigint): Promise<FindPotentialMatchesResult>;
}
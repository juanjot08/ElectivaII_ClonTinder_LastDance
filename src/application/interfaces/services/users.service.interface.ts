import { Result } from "ts-results-es";
import { User } from "../../../domain/entities/user";
import { UpdateUserDTO } from "../dtos/users/serviceRequest/updateuser.dto";
import { IUserResponseDTO } from "../dtos/users/serviceResponse/user.response";

export interface IUsersService {

	getUser(id: bigint): Promise<Result<IUserResponseDTO, string>>;
	
	postUser(user: User): Promise<IUserResponseDTO | null>;
	
	updateUser(id: bigint, userUpdateDto: UpdateUserDTO): Promise<Result<IUserResponseDTO, string>>;
	
	createInitialProfile(idenityId: bigint): Promise<Result<IUserResponseDTO, string>>;
	
	getUserByIdentityId(identityId: bigint): Promise<Result<User, string>>;

	updateProfilePhoto(userId: bigint, file: Express.Multer.File): Promise<Result<string, string>>;
}
import { Result } from "ts-results-es";
import { User } from "../../../domain/entities/user";
import { UpdateUserDTO } from "../dtos/users/serviceRequest/updateuser.dto";
import { IUserResponseDTO } from "../dtos/users/serviceResponse/user.response";
import { FindPotentialMatchesResult } from "../dtos/users/repositoryResponse/potentialMatches.response";

export interface IUsersService {

	getUser(id: bigint): Promise<Result<IUserResponseDTO, string>>;
	
	postUser(user: User): Promise<IUserResponseDTO | null>;
	
	updateUser(id: bigint, userUpdateDto: UpdateUserDTO): Promise<Result<IUserResponseDTO, string>>;
	
	createInitialProfile(idenityId: bigint): Promise<Result<IUserResponseDTO, string>>;
	
	getUserByIdentityId(identityId: bigint): Promise<Result<User, string>>;

	getPotentialMatches(userId: bigint, lastId?: bigint): Promise<Result<FindPotentialMatchesResult, string>>;

	updateProfilePhoto(userId: bigint, file: Express.Multer.File): Promise<Result<string, string>>;

	updateAdditionalProfilePhotos(userId: bigint, files: Express.Multer.File[]): Promise<Result<string, string>>;
}
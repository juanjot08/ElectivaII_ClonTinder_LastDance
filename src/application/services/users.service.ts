import { inject, injectable } from "tsyringe";
import { User } from "../../domain/entities/user";
import { IUsersService } from "../interfaces/services/users.service.interface";
import { TYPES } from "../dependencyInjection/container.types";
import { IUsersRepository } from "../interfaces/infrastructure/users.repository.interface";
import { UpdateUserDTO } from "../interfaces/dtos/users/serviceRequest/updateuser.dto";
import { Result, Ok, Err } from "ts-results-es";
import { IUserResponseDTO } from "../interfaces/dtos/users/serviceResponse/user.response";
import { IUserImagesRepository } from "../interfaces/infrastructure/user.images.repository";

@injectable()
export class UsersService implements IUsersService {

	constructor(
		@inject(TYPES.IUserRepository) private _usersRepository: IUsersRepository,
		@inject(TYPES.IUserImagesRepository) private _userPhotosRepository: IUserImagesRepository,
	) { }

	public async createInitialProfile(identityId: bigint): Promise<Result<IUserResponseDTO, string>> {
		const user = new User(identityId);

		await this._usersRepository.createUser(user);

		return Ok(new IUserResponseDTO(user));
	}

	public async updateProfilePhoto(userId: bigint, file: Express.Multer.File): Promise<Result<string, string>> {
		const user = await this._usersRepository.getUser(userId);

		if (user == null) {
			return Err("User not found");
		}

		const uploadedResponse = await this._userPhotosRepository.createProfilePhoto(userId, file);

		if (uploadedResponse.isErr()) {
			return Err(uploadedResponse.error);
		}

		await this._usersRepository.updateUser(userId, { profilePhoto: uploadedResponse.value.url });

		return Ok("Profile photo uploaded successfully");
	}

	public async postUser(user: User): Promise<IUserResponseDTO | null> {
		return await this._usersRepository.createUser(user);
	}

	public async updateUser(id: bigint, updateUserDto: UpdateUserDTO): Promise<Result<IUserResponseDTO, string>> {

		const user = await this._usersRepository.updateUser(id, updateUserDto);

		if (user == null) {
			return Err("User not found");
		}

		return Ok(new IUserResponseDTO(user));
	}

	public async getUser(id: bigint): Promise<Result<IUserResponseDTO, string>> {
		const user = await this._usersRepository.getUser(id);

		if (user == null) {
			return Err("User not found");
		}

		return Ok(new IUserResponseDTO(user));
	}

	public async getUserByIdentityId(identityId: bigint): Promise<Result<User, string>> {
		const user = await this._usersRepository.getUserByIdentityId(identityId);

		if (user == null) {
			return Err("User not found");
		}

		return Ok(user);
	}
}
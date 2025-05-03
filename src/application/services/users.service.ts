import { inject, injectable } from "tsyringe";
import { User } from "../../domain/entities/user";
import { IUsersService } from "../interfaces/services/users.service.interface";
import { TYPES } from "../dependencyInjection/container.types";
import { IUsersRepository } from "../interfaces/infrastructure/users.repository.interface";
import { UpdateUserDTO } from "../interfaces/dtos/users/serviceRequest/updateuser.dto";
import { Result, Ok, Err } from "ts-results-es";
import { IUserResponseDTO } from "../interfaces/dtos/users/serviceResponse/user.response";
import { IUserImagesRepository } from "../interfaces/infrastructure/user.images.repository";
import { FindPotentialMatchesResult } from "../interfaces/dtos/users/repositoryResponse/potentialMatches.response";
import { ISwipeService } from "../interfaces/services/swipe.service.interface";
import appsettings from "../../appsettings.json";

@injectable()
export class UsersService implements IUsersService {

	constructor(
		@inject(TYPES.IUserRepository) private _usersRepository: IUsersRepository,
		@inject(TYPES.IUserImagesRepository) private _userPhotosRepository: IUserImagesRepository,
		@inject(TYPES.ISwipeService) private _swipeService: ISwipeService,
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

	public async updateAdditionalProfilePhotos(userId: bigint, files: Express.Multer.File[]): Promise<Result<string, string>> {
		
		const user = await this._usersRepository.getUser(userId);

		if (user == null) {
			return Err("User not found");
		}

		const imagesUrls: string[] = [];

		for (const file of files) {
			const uploadedResponse = await this._userPhotosRepository.createAdditionalProfilePhoto(userId, file);

			if (uploadedResponse.isErr()) {
				return Err(uploadedResponse.error);
			}

			imagesUrls.push(uploadedResponse.value.url);

		}

		await this._usersRepository.updateUser(userId, { additionalPhotos: imagesUrls });

		return Ok("Additional profile photos uploaded successfully");

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

	public async getPotentialMatches(userId: bigint, lastId?: bigint): Promise<Result<FindPotentialMatchesResult, string>> {

		const user = await this._usersRepository.getUser(userId);

		if (user == null) {
			return Err("User not found");
		}

		if (user.preferences == null) {
			return Err("User preferences not set");
		}

		const swipedIds = await this._swipeService.getSwipeHistory(userId);

		const excludedIds = [
			...(swipedIds?.map((swipe) => swipe.targetUserId) || []),
			userId
		]

		const potentialMatches = await this._usersRepository.getPotentialMatches(
			user,
			excludedIds,
			appsettings.businessRules.limitForPotentialMatches,
			lastId);

		if (potentialMatches.users == null) {
			return Err("No potential matches found, adjust your preferences.");
		}

		return Ok(potentialMatches);
	}

	public async getUserByIdentityId(identityId: bigint): Promise<Result<User, string>> {
		const user = await this._usersRepository.getUserByIdentityId(identityId);

		if (user == null) {
			return Err("User not found");
		}

		return Ok(user);
	}
}
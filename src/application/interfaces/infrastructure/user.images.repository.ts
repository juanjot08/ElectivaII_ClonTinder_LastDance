import { Result } from "ts-results-es";
import { IUserProfilePhotoRepositoryResponse } from "../dtos/users/repositoryResponse/createProfilePhoto.response";

export interface IUserImagesRepository {
	createProfilePhoto(userId: bigint, file: Express.Multer.File): Promise<Result<IUserProfilePhotoRepositoryResponse, string>>;
	getProfilePhoto(userId: bigint): Promise<Buffer | null>;
}
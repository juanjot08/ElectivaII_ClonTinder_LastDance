import { Result } from "ts-results-es";
import { IUsePhotoRepositoryResponse } from "../dtos/users/repositoryResponse/createProfilePhoto.response";

export interface IUserImagesRepository {
	createProfilePhoto(userId: bigint, file: Express.Multer.File): Promise<Result<IUsePhotoRepositoryResponse, string>>;
	createAdditionalProfilePhoto(userId: bigint, file: Express.Multer.File): Promise<Result<IUsePhotoRepositoryResponse, string>>;
	getProfilePhoto(userId: bigint): Promise<Buffer | null>;
}
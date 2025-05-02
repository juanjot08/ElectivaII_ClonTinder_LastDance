import { inject, injectable } from "tsyringe";
import { IUserImagesRepository } from "../../../application/interfaces/infrastructure/user.images.repository";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { AzureBlobStorageAdapter } from "../common/azureblobstorage.adapter";
import { Ok, Result } from "ts-results-es";
import { IUsePhotoRepositoryResponse } from "../../../application/interfaces/dtos/users/repositoryResponse/createProfilePhoto.response";
import { randomUUID } from "crypto";

@injectable()
export class UserImagesRepository implements IUserImagesRepository {

	constructor(@inject(TYPES.BlobStorageClient) private _blobStorageClient: AzureBlobStorageAdapter) { }

	public async createProfilePhoto(userId: bigint, file: Express.Multer.File): Promise<Result<IUsePhotoRepositoryResponse, string>> {

		const containerName = "user-images";
		const fileName = `profilephotos/${userId}`;
		const result = await this._blobStorageClient.upload(file, containerName, fileName);

		if (result.isErr()) {
			return result;
		}

		console.log(`Profile photo uploaded successfully: ${result.value.url}`);

		const response: IUsePhotoRepositoryResponse = {
			url: result.value.url,
			blobName: result.value.blobName
		};

		return Ok(response);
	}

	public async createAdditionalProfilePhoto(userId: bigint, file: Express.Multer.File): Promise<Result<IUsePhotoRepositoryResponse, string>> {

		const containerName = "user-images";
		const fileName = `additionalprofilephotos/${userId}-${randomUUID()}`;
		
		const result = await this._blobStorageClient.upload(file, containerName, fileName);

		if (result.isErr()) {
			return result;
		}

		console.log(`Additional profile photo uploaded successfully: ${result.value.url}`);

		const response: IUsePhotoRepositoryResponse = {
			url: result.value.url,
			blobName: result.value.blobName
		};
		
		return Ok(response);
	}

	public async getProfilePhoto(userId: bigint): Promise<Buffer | null> {

		const containerName = "user-images";
		const fileName = `profilephotos/${userId}`;

		const result = await this._blobStorageClient.read(fileName, containerName);

		if (result.isErr()) {

			return null;
		}

		return result.value;
	}

}
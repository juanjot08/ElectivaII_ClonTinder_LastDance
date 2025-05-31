import {
	BlobServiceClient,
	ContainerClient,
	BlockBlobClient,
	BlobItem,
	BlobUploadCommonResponse
} from '@azure/storage-blob';

import { Err, Ok, Result } from 'ts-results-es';
import { inject, injectable } from 'tsyringe';
import { TYPES } from '../../../application/dependencyInjection/container.types';

@injectable()
export class AzureBlobStorageAdapter {
	private blobServiceClient: BlobServiceClient;
	private containerClients: { [key: string]: ContainerClient } = {};

	constructor(@inject(TYPES.BlobStorageConnectionString) connectionString: string) {
		this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
	}

	public async upload(
		file: Express.Multer.File,
		containerName: string,
		fileName: string,
	): Promise<Result<{ blobName: string; url: string }, string>> {
		try {

			const blobName = fileName;
			const blockBlobClient = this.getBlockBlobClient(blobName, containerName);

			const blobExists = await blockBlobClient.exists();

			if (blobExists) {
				await blockBlobClient.delete();
			}

			const uploadResponse: BlobUploadCommonResponse = await blockBlobClient.uploadData(file.buffer, {
				blobHTTPHeaders: { blobContentType: file.mimetype },
			});

			if (uploadResponse.requestId) {
				return Ok({ blobName, url: blockBlobClient.url });
			} else {
				console.error(`Error uploading blob to container ${containerName}:`, uploadResponse);
				return Err(`Failed to upload file to container ${containerName}.`);
			}

		} catch (error) {
			console.error(`Error uploading blob to container ${containerName}:`, error);
			return Err(`Failed to upload file to container ${containerName}.`);
		}
	}

	public async list(containerName: string, prefix: string = ''): Promise<Result<BlobItem[], string>> {
		try {

			const blobs: BlobItem[] = [];

			for await (const blob of this.getContainerClient(containerName).listBlobsFlat({ prefix })) {
				blobs.push(blob);
			}

			return Ok(blobs);

		} catch (error) {

			console.error(`Error listing blobs in container ${containerName}:`, error);
			return Err(`Failed to list blobs in container ${containerName}.`);
		}
	}

	public async read(blobName: string, containerName: string): Promise<Result<Buffer, string>> {
		try {
			const blockBlobClient = this.getBlockBlobClient(blobName, containerName);

			const downloadResponse = await blockBlobClient.download();

			if (downloadResponse.readableStreamBody) {
				const downloaded = await this.streamToBuffer(downloadResponse.readableStreamBody);
				return Ok(downloaded);
			}

			return Err(`Blob ${blobName} not found in container ${containerName}.`);

		} catch (error: any) {

			console.error(`Error reading blob ${blobName} from container ${containerName}:`, error);
			return Err(`Failed to read blob ${blobName} from container ${containerName}.`);
		}
	}

	public async delete(blobName: string, containerName: string): Promise<Result<null, string>> {
		try {
			const blockBlobClient = this.getBlockBlobClient(blobName, containerName);
			const deleteResponse = await blockBlobClient.delete();

			if (deleteResponse.requestId) {
				return Ok(null);
			} else {
				console.error(`Error deleting blob ${blobName} from container ${containerName}:`, deleteResponse);
				return Err(`Failed to delete blob ${blobName} from container ${containerName}.`);
			}

		} catch (error) {

			console.error(`Error deleting blob ${blobName} from container ${containerName}:`, error);
			return Err(`Failed to delete blob ${blobName} from container ${containerName}.`);
		}
	}

	private getContainerClient(containerName: string): ContainerClient {

		if (!this.containerClients[containerName]) {
			this.containerClients[containerName] = this.blobServiceClient.getContainerClient(containerName);
		}

		return this.containerClients[containerName];
	}

	private getBlockBlobClient(blobName: string, containerName: string): BlockBlobClient {
		return this.getContainerClient(containerName).getBlockBlobClient(blobName);
	}

	private async streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {

		return new Promise((resolve, reject) => {
			const chunks: Buffer[] = [];
			readableStream.on('data', (data) => {
				chunks.push(data instanceof Buffer ? data : Buffer.from(data));
			});
			readableStream.on('end', () => {
				resolve(Buffer.concat(chunks));
			});
			readableStream.on('error', reject);
		});
	}
}

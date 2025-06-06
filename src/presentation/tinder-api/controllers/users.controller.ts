import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe';
import { TYPES } from '../../../application/dependencyInjection/container.types';
import { IUsersService } from '../../../application/interfaces/services/users.service.interface';
import { UpdateUserDTO } from '../../../application/interfaces/dtos/users/serviceRequest/updateuser.dto';
import { BadRequestError, NotFoundError } from './base/api.hanldlederror';
import { sendSuccess } from './base/success.response.handler';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import appSettings from '../../../appsettings.json';

@injectable()
class UserController {

	constructor(@inject(TYPES.IUserService) private _usersService: IUsersService) { }

	public async getUserProfile(req: Request, res: Response): Promise<void> {
		const { userId } = req.params;

		const user = await this._usersService.getUser(BigInt(userId));

		if (user.isErr()) {
			throw new NotFoundError(user.error);
		}

		sendSuccess(res, StatusCodes.OK, user.value);
	}

	public async updateUserProfile(req: Request, res: Response): Promise<void> {

		const parsedRequest = req.body as UpdateUserDTO;

		const userResponse = await this._usersService.updateUser(BigInt(req.params.userId), parsedRequest);

		if (userResponse.isErr()) {
			throw new NotFoundError(userResponse.error);
		}

		sendSuccess(res, StatusCodes.OK, userResponse.value);
	}

	public async getPotentialMatches(req: Request, res: Response): Promise<void> {
		const { userId } = req.params;
		const { lastId } = req.query;
		
		const parsedLastId = lastId ? BigInt(lastId as string) : undefined;

		const potentialMatches = await this._usersService.getPotentialMatches(BigInt(userId), parsedLastId);

		if (potentialMatches.isErr()) {
			throw new BadRequestError(potentialMatches.error);
		}

		sendSuccess(res, StatusCodes.OK, potentialMatches.value);
	}

	private uploadProfilePhotoHandler = multer({ storage: multer.memoryStorage() }).single('profilePhoto');

	public async updateProfilePhoto(req: Request, res: Response): Promise<void> {

		this.uploadProfilePhotoHandler(req, res, async (err) => {

			if (err) {
				throw new BadRequestError('Error uploading file');
			}

			const { userId } = req.params;
			const file = req.file;

			if (!file) {
				throw new BadRequestError('No file uploaded');
			}

			const result = await this._usersService.updateProfilePhoto(BigInt(userId), file);

			if (result.isErr()) {
				throw new NotFoundError(result.error);
			}

			sendSuccess(res, StatusCodes.OK, null, result.value);
		});

	}

	private uploadAdditionalProfilePhotosHandler = multer({ storage: multer.memoryStorage() })
																								.array('additionalProfilePhotos', appSettings.businessRules.maxAdditionalProfilePhotos);

	public async updateAdditionalProfilePhotos(req: Request, res: Response): Promise<void> {
		this.uploadAdditionalProfilePhotosHandler(req, res, async (err) => {

			if (err) {
				throw new BadRequestError('Error uploading file');
			}

			const { userId } = req.params;
			const files = req.files as Express.Multer.File[];

			if (!files || files.length === 0) {
				throw new BadRequestError('No file uploaded');
			}

			const result = await this._usersService.updateAdditionalProfilePhotos(BigInt(userId), files);

			if (result.isErr()) {
				throw new NotFoundError(result.error);
			}

			sendSuccess(res, StatusCodes.OK, null, result.value);
		});
	}
}

export default UserController;
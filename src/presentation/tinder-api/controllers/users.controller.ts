import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe';
import { TYPES } from '../../../application/dependencyInjection/container.types';
import { IUsersService } from '../../../application/interfaces/services/users.service.interface';
import { UpdateUserDTO } from '../../../application/interfaces/dtos/users/serviceRequest/updateuser.dto';
import { NotFoundError } from './base/api.hanldlederror';
import { sendSuccess } from './base/success.response.handler';
import { StatusCodes } from 'http-status-codes';
import { IUserResponseDTO } from '../../../application/interfaces/dtos/users/serviceResponse/user.response';

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
}

export default UserController;
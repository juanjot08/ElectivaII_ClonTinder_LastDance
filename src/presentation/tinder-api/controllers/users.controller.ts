import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe';
import { TYPES } from '../../../application/dependencyInjection/container.types';
import { IUsersService } from '../../../application/interfaces/services/users.service.interface';
import { UpdateUserDTO } from '../../../application/interfaces/dtos/users/serviceRequest/updateuser.dto';

@injectable()
class UserController {

	constructor(@inject(TYPES.IUserService) private _usersService: IUsersService) { }

	public async getUserProfile(req: Request, res: Response): Promise<void> {
		const { userId } = req.params;

		const user = await this._usersService.getUser(BigInt(userId));

		if (user.isErr()) {
			res.status(404).json({ error: user.error });
			return;
		}
		
		res.json(user.value);
	}

	public async createUserProfile(req: Request, res: Response): Promise<void> {

		const parsedRequest = req.body as UpdateUserDTO;

		const userResponse = await this._usersService.updateUser(BigInt(req.params.userId), parsedRequest);
		
		if (userResponse.isErr()) {
			res.status(400).json({ error: userResponse.error });
			return;
		}

		res.json(userResponse.value);
	}
}

export default UserController;
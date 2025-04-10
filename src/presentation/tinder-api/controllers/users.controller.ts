import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe';
import { TYPES } from '../../../application/dependencyInjection/container.types';
import { IUsersService } from '../../../application/interfaces/services/users.service.interface';

@injectable()
class UserController {

    constructor(@inject(TYPES.IUserService) private _usersService: IUsersService) { }

    public getAvailableUsers(req: Request, res: Response): void {
        const { userId } = req.query;

        if (!userId) {
            return void res.status(400).json({ error: 'UserId is required' });
        }

        // Simulación de lista de usuarios disponibles (esto debería venir de la BD)
        const availableUsers = [
            { userId: '67890', name: 'Jane Doe', age: 25, bio: 'Love hiking and coffee!' },
            { userId: '54321', name: 'Mike Smith', age: 30, bio: 'Adventurer and tech geek' },
        ];

        res.status(200).json(availableUsers);
    }

    public async getUserProfile(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;

        const user = await this._usersService.getUser(Number.parseInt(userId));

        res.json(user);
    }
}

export default UserController;
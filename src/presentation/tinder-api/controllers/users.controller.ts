import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe';
import { TYPES } from '../../../application/dependencyInjection/container.types';
import { IUsersService } from '../../../application/interfaces/services/users.service.interface';
import { User } from '../../../domain/entities/user';
import { UpdateUserDTO } from '../dtos/updateuser.dto';

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

    public async createUser(req: Request, res: Response): Promise<void> {
        const { id, name, age, gender, preferences, location, profilePhoto } = req.body;
        const user = new User(id, name, age, gender, preferences, location, profilePhoto);
        const userResponse = await this._usersService.postUser(user);
        res.json(userResponse);
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        const updateData = req.body;
        const { userId } = req.params;

        const updateUserDto: UpdateUserDTO = new UpdateUserDTO(updateData);

        const userResponse = await this._usersService.updateUser(Number.parseInt(userId), updateUserDto);
        res.json(userResponse);
    }

    public async getUsers(req: Request, res: Response): Promise<void> {
        const userResponse = await this._usersService.getUsers();
        res.json(userResponse);
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
        const userResponse = await this._usersService.deleteUser(Number.parseInt(userId));
        if(!userResponse){
            res.status(404).json({ error: 'User not found' });
        }
        res.status(204)
    }

}

export default UserController;
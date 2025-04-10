import { inject, injectable } from "tsyringe";
import { User } from "../../domain/entities/user";
import { IUsersService } from "../interfaces/services/users.service.interface";
import { TYPES } from "../dependencyInjection/container.types";
import { IUsersRepository } from "../interfaces/infrastructure/users.repository.interface";

@injectable()
export class UsersService implements IUsersService {

    constructor(@inject(TYPES.IUserRepository) private _usersRepository: IUsersRepository) { }

    public async getUser(id: Number): Promise<User | null> {
        return await this._usersRepository.getUser(id);
    }
}
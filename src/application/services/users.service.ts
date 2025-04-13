import { inject, injectable } from "tsyringe";
import { User } from "../../domain/entities/user";
import { IUsersService } from "../interfaces/services/users.service.interface";
import { TYPES } from "../dependencyInjection/container.types";
import { IUsersRepository } from "../interfaces/infrastructure/users.repository.interface";
import { UpdateUserDTO } from "../../presentation/tinder-api/dtos/updateuser.dto";

@injectable()
export class UsersService implements IUsersService {

    constructor(@inject(TYPES.IUserRepository) private _usersRepository: IUsersRepository) { }
    
    public async postUser(user: User): Promise<User | null> {
        return await this._usersRepository.postUser(user);
    }
    public async updateUser(id: Number, updateUserDto: UpdateUserDTO): Promise<User | null> {
        return await this._usersRepository.updateUser(id, updateUserDto);
    }
    public async deleteUser(id: Number): Promise<Boolean> {
        return await this._usersRepository.deleteUser(id);
    }
    public async getUsers(): Promise<User[]> {
        return await this._usersRepository.getUsers();
    }

    public async getUser(id: Number): Promise<User | null> {
        return await this._usersRepository.getUser(id);
    }

    
}
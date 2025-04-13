import { inject, injectable } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { IUsersRepository } from "../../../application/interfaces/infrastructure/users.repository.interface";
import { Location } from "../../../domain/valueObjects/location";
import { User } from "../../../domain/entities/user";
import { MongooseConfig } from "../mongo.config";
import { IUser, UserSchema } from "../models/user.model";
import { Model } from "mongoose";
import { UpdateUserDTO } from "../../../presentation/tinder-api/dtos/updateuser.dto";

@injectable()
export class UsersRepository implements IUsersRepository {

    private readonly _userModel: Model<IUser>;

    constructor(@inject(TYPES.MongooseConfig) private _dbContext: MongooseConfig) {
        this._userModel = _dbContext.connection.model<IUser>("Users", UserSchema, "Users");
    }
    public async updateUser(id: Number, updateUserDto: UpdateUserDTO): Promise<User | null> {
        return await this._userModel.findOneAndUpdate({id}, updateUserDto, { new: true });
    }
    public async deleteUser(id: Number): Promise<boolean> {
        return await this._userModel.findOneAndDelete({id}).then((result) => {
            console.log(result)
            if (result) {
                return true;
            }
            return false;
        });
    }
    public async getUsers(): Promise<User[]> {
        return await this._userModel.find();
    }

    public async getUser(id: Number): Promise<User | null> {
        const user = await this._userModel.findOne({id});

        if (user == null)
            return null;

        return this.toEntity(user);
    }

    public async postUser(user: User): Promise<User | null> {
        const userResponse = await this._userModel.create(user);
        console.log(userResponse);
        if (userResponse == null)
            return null;

        return this.toEntity(userResponse);
    }

    private toEntity(dbData: any): User {
        const { id, name, age, gender, preferences, location, profilePhoto } = dbData;

        if (!location || !location.city || !location.country) {
            throw new Error("Invalid location data from database");
        }

        const userLocation = new Location(location.city, location.country);

        return new User(
            id,
            name,
            age,
            gender,
            preferences,
            userLocation,
            profilePhoto
        );
    }
}
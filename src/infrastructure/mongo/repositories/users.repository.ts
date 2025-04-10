import { inject, injectable } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { IUsersRepository } from "../../../application/interfaces/infrastructure/users.repository.interface";
import { Location } from "../../../domain/valueObjects/location";
import { User } from "../../../domain/entities/user";
import { MongooseConfig } from "../mongo.config";
import { IUser, UserSchema } from "../models/user.model";
import { Model } from "mongoose";

@injectable()
export class UsersRepository implements IUsersRepository {

    private readonly _userModel: Model<IUser>;

    constructor(@inject(TYPES.MongooseConfig) private _dbContext: MongooseConfig) {
        this._userModel = _dbContext.connection.model<IUser>("Users", UserSchema, "Users");
    }

    public async getUser(id: Number): Promise<User | null> {
        const user = await this._userModel.findOne({id});

        if (user == null)
            return null;

        return this.toEntity(user);
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
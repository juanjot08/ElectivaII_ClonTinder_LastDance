import { inject, injectable } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { IUsersRepository } from "../../../application/interfaces/infrastructure/users.repository.interface";
import { Location } from "../../../domain/valueObjects/location";
import { User } from "../../../domain/entities/user";
import { MongooseConfig } from "../mongo.config";
import { IUser, UserSchema } from "../models/user.model";
import { Model } from "mongoose";
import { UpdateUserDTO } from "../../../application/interfaces/dtos/users/serviceRequest/updateuser.dto";

@injectable()
export class UsersRepository implements IUsersRepository {

	private readonly _userModel: Model<IUser>;

	constructor(@inject(TYPES.MongooseConfig) private _dbContext: MongooseConfig) {
		this._userModel = _dbContext.connection.model<IUser>("Users", UserSchema, "Users");
	}
	
	public async updateUser(id: bigint, updateUserDto: UpdateUserDTO): Promise<User | null> {
		return await this._userModel.findOneAndUpdate({ id }, updateUserDto, { new: true });
	}
	
	public async deleteUser(id: bigint): Promise<boolean> {
		return await this._userModel.findOneAndDelete({ id }).then((result) => {
			
			if (result) {
				return true;
			}
			return false;
		});
	}
	
	public async getUsers(): Promise<User[]> {
		return await this._userModel.find();
	}
	
	public async getUser(id: bigint): Promise<User | null> {
		const user = await this._userModel.findOne({ id });
		
		if (user == null)
			return null;
		
		return this.toEntity(user);
	}

	public async getUserByIdentityId(identityId: bigint): Promise<User | null> {
		const user = await this._userModel.findOne({ identityId });

		if (user == null)
			return null;

		return this.toEntity(user);
	}

	public async createUser(user: User): Promise<User | null> {
		const userResponse = await this._userModel.create(user);

		if (userResponse == null)
			return null;

		return this.toEntity(userResponse);
	}

	private toEntity(dbData: IUser): User {
		const { id, identityId, name, age, gender, preferences, location, profilePhoto } = dbData;

		const userLocation = location ? new Location(location.city, location.country) : undefined;

		return new User(
			identityId,
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
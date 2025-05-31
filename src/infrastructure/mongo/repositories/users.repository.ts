import { inject, injectable } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { IUsersRepository } from "../../../application/interfaces/infrastructure/users.repository.interface";
import { Location } from "../../../domain/valueObjects/location";
import { User } from "../../../domain/entities/user";
import { MongooseConfig } from "../mongo.config";
import { IUser, UserSchema } from "../models/user.model";
import { FilterQuery, Model } from "mongoose";
import { UpdateUserDTO } from "../../../application/interfaces/dtos/users/serviceRequest/updateuser.dto";
import { FindPotentialMatchesResult } from "../../../application/interfaces/dtos/users/repositoryResponse/potentialMatches.response";

@injectable()
export class UsersRepository implements IUsersRepository {

	private readonly _userModel: Model<IUser>;

	constructor(@inject(TYPES.MongooseConfig) _dbContext: MongooseConfig) {
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

	public async getPotentialMatches(user: User, excludedIds: bigint[], limit: number, lastId?: bigint): Promise<FindPotentialMatchesResult> {

		const query: FilterQuery<any> = {
			id: { $nin: excludedIds },
			$and: [
				{ gender: user.preferences?.interestedInGender },
				{
					age: {
						$gte: user.preferences?.minAge,
						$lte: user.preferences?.maxAge
					}
				},
				{ "preferences.interestedInGender": user.gender },
				{ "preferences.minAge": { $lte: user.age } },
				{ "preferences.maxAge": { $gte: user.age } },
				{ "location.city": { $eq: user.location?.city } } ,
			],
		};

		if (lastId !== undefined) {
			query.id = { ...query.id, $gt: lastId };
		}

		const userDocs = await this._userModel.find(query)
			.sort({ id: 1 })
			.limit(limit)
			.exec();

		if (userDocs.length === 0) {
			return { users: null, nextCursor: { lastId: null } };
		}

		const users = userDocs.map((userDoc) => this.toEntity(userDoc));

		let nextCursorId: bigint | null = null;

		if (users.length === limit) {
			nextCursorId = users[users.length - 1].id;
		}

		return {
			users: users,
			nextCursor: { lastId: nextCursorId }
		};
	}

	private toEntity(dbData: IUser): User {
		const { id, identityId, name, age, gender, preferences, location, profilePhoto, additionalPhotos: additionalPhotos, bio } = dbData;

		const userLocation = location ? new Location(location.city, location.country) : undefined;

		return new User(
			identityId,
			id,
			name,
			age,
			gender,
			preferences,
			userLocation,
			profilePhoto,
			bio,
			additionalPhotos
		);
	}
}
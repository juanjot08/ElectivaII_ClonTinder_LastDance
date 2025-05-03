import { inject, injectable } from "tsyringe";
import { Model } from "mongoose";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { IIdentityRepository } from "../../../application/interfaces/infrastructure/identity.repository.interface";
import { MongooseConfig } from "../mongo.config";
import { Identity } from "../../../domain/entities/identity";
import { IAuthIdentity, AuthIdentitySchema } from "../models/identity.model";

@injectable()
export class IdentityRepository implements IIdentityRepository {
	private readonly _identityModel: Model<IAuthIdentity>;

	constructor(@inject(TYPES.MongooseConfig) _dbContext: MongooseConfig) {
		this._identityModel = _dbContext.connection.model<IAuthIdentity>("Identity", AuthIdentitySchema, "Identity");
	}

	public async createIdentityUser(identity: Identity): Promise<void> {
		await this._identityModel.create(identity);
	}

	public async findIdentityUserByEmail(email: string): Promise<Identity | null> {
		const identity = await this._identityModel.findOne({ email });

		if (!identity) {
			return null;
		}

		return this.toDomain(identity);
	}

	private toDomain(dbData: IAuthIdentity): Identity {
		const { id, email, password, authProvider } = dbData;

		return new Identity(email, password, authProvider, id);
	}
}
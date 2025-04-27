import { Identity } from "../../../domain/entities/identity";

export interface IIdentityRepository {
	createIdentityUser(identity: Identity): Promise<void>;
	findIdentityUserByEmail(email: string): Promise<Identity | null>;
}
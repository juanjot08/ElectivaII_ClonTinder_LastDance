import { Document, Schema } from "mongoose";

export interface IAuthIdentity extends Document {
	id: bigint;
	email: string;
	password: string;
	authProvider: string;
}

export const AuthIdentitySchema: Schema = new Schema({
	id: { type: BigInt, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: false },
	authProvider: { type: String, required: true },
}, {
	versionKey: false
});

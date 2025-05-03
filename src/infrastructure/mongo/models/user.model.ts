import { Schema, Document } from "mongoose";

export interface ILocation extends Document {
  city: string;
  country: string;
}

export const LocationSchema: Schema = new Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
}, {
	versionKey: false,
	_id: false,
});

export interface IPreferences extends Document {
	minAge: number;
	maxAge: number;
	interestedInGender: string;
	maxDistance: number;
}

export const PreferencesSchema: Schema = new Schema({
	minAge: { type: Number, required: true },
	maxAge: { type: Number, required: true },
	interestedInGender: { type: String, required: true },
	maxDistance: { type: Number, required: true },
}, {
	versionKey: false,
	_id: false,
});

export interface IUser extends Document {
  id: bigint;
	identityId: bigint;
  name?: string;
  age?: number;
  gender?: string;
  preferences?: any;
  location?: ILocation;
  profilePhoto?: string;
	bio?: string;
	additionalPhotos?: string[];
}

export const UserSchema: Schema = new Schema({
  id: { type: BigInt, required: true, unique: true },
	identityId: { type: BigInt, required: true }, 
  name: { type: String, required: false, default: null },
  age: { type: Number, required: false, default: null },
  gender: { type: String, required: false, default: null },
  preferences: { type: PreferencesSchema, required: false, default: null }, 
  location: { type: LocationSchema, required: false, default: null }, 
  profilePhoto: { type: String, required: false, default: null },
	bio: { type: String, required: false, default: null },
	additionalPhotos: { type: [String], required: false, default: null },
}, {
	versionKey: false
});
import { Schema, Document } from "mongoose";

export interface ILocation extends Document {
  city: string;
  country: string;
}

export const LocationSchema: Schema = new Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
});

export interface IUser extends Document {
  id: number;
  name: string;
  age: number;
  gender: string;
  preferences: any;
  location: ILocation;
  profilePhoto: string;
}

export const UserSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true }, 
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  preferences: { type: Schema.Types.Mixed }, 
  location: { type: LocationSchema, required: true }, 
  profilePhoto: { type: String, required: true },
});
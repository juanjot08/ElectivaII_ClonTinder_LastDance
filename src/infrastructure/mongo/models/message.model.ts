import { Schema, Document } from "mongoose";

export interface IMessage extends Document {
	id: bigint;
	senderId: bigint;
	matchId: bigint;
	content: string;
	timestamp: Date;
}

export const MessageSchema: Schema = new Schema(
	{
		id: { type: BigInt, required: true, unique: true },
		senderId: { type: BigInt, required: true },
		matchId: { type: BigInt, required: true },
		content: { type: String, required: true },
		timestamp: { type: Date, required: true, default: Date.now },
	},
	{
		versionKey: false,
	}
);
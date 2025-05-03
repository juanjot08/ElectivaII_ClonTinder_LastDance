import { Schema, Document } from "mongoose";
import { SwipeAction } from "../../../domain/enumerables/swipeAction.enum";

export interface ISwipe extends Document {
	userId: bigint;
	targetUserId: bigint;
	swipeType: SwipeAction;
	timestamp: Date;
}

export const SwipeSchema = new Schema<ISwipe>({
	userId: {
		type: BigInt,
		required: true,
	},
	targetUserId: {
		type: BigInt,
		required: true,
	},
	swipeType: {
		type: String,
		enum: Object.values(SwipeAction),
		required: true,
	},
	timestamp: {
		type: Date,
		required: true,
		default: Date.now,
	},
},
{
	versionKey: false,
});
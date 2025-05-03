import { Schema, Document } from "mongoose";

export interface IMatch extends Document {
  id: bigint;
  userId: bigint;
  targetUserId: bigint;
  createdAt: Date;
}

export const MatchSchema = new Schema<IMatch>({
  id: {
    type: BigInt, 
    required: true,
		unique: false
  },
  userId: {
    type: BigInt, 
    required: true,
  },
  targetUserId: {
    type: BigInt, 
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
},
{
	versionKey: false,
});

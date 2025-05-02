import { Id } from "../valueObjects/id";

export class Match {

	constructor(userId: bigint, targetUserId: bigint, createdAt?: Date, id?: bigint) {
		this.id = id ?? Id.new();
		this.userId = userId;
		this.targetUserId = targetUserId;
		this.createdAt = createdAt ?? new Date();
	}

	public id: bigint;

	public userId: bigint;

	public targetUserId: bigint;

	public createdAt: Date;
}
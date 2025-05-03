import { Id } from "../valueObjects/id";

export class Message {
	id: bigint;
	senderId: bigint;
	matchId: bigint;
	content: string;
	timestamp: Date;

	constructor(
		senderId: bigint,
		content: string,
		matchId: bigint,
		timestamp: Date,
		id?: bigint
	) {
		this.id = id ?? Id.new();
		this.senderId = senderId;
		this.content = content;
		this.timestamp = timestamp;
		this.matchId = matchId;
	}
}
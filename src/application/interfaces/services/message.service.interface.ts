import { Result } from "ts-results-es";
import { Message } from "../../../domain/entities/message";

export interface IMessageService {
	getMessagesByMatchId(matchId: bigint): Promise<Result<Message[], string>>;
	createMessage(senderId: bigint, matchId: bigint, message: string): Promise<Result<Message, string>>;
}
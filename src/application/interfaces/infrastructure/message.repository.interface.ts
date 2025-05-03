import { Message } from "../../../domain/entities/message";

export interface IMessageRepository {
	getMessagesByMatchId(matchId: bigint): Promise<Message[] | null>;
	createMessage(message: Message): Promise<Message | null>;
	deleteMessage(messageId: bigint): Promise<void>;
}
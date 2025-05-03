import { inject, injectable } from "tsyringe";
import { IMessageService } from "../interfaces/services/message.service.interface";
import { IMessageRepository } from "../interfaces/infrastructure/message.repository.interface";
import { Message } from "../../domain/entities/message";
import { Err, Ok, Result } from "ts-results-es";
import { TYPES } from "../dependencyInjection/container.types";

@injectable()
export class MessageService implements IMessageService {
	constructor(
		@inject(TYPES.IMessageRepository) private messageRepository: IMessageRepository,
	) { }

	public async getMessagesByMatchId(matchId: bigint): Promise<Result<Message[], string>> {
		const messages = await this.messageRepository.getMessagesByMatchId(matchId);

		if (messages == null) {
			return Err("No messages found for this match.");
		}

		return Ok(messages);
	}

	public async createMessage(senderId: bigint, matchId: bigint, message: string): Promise<Result<Message, string>> {
		const newMessage = new Message(senderId, message, matchId, new Date());

		const createdMessage = await this.messageRepository.createMessage(newMessage);

		if (createdMessage == null) {
			return Err("Failed to create message.");
		}

		return Ok(createdMessage);
	}
}
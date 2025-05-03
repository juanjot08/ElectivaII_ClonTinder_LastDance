import { inject, injectable } from "tsyringe";
import { IMessageRepository } from "../../../application/interfaces/infrastructure/message.repository.interface";
import { Message } from "../../../domain/entities/message";
import { MongooseConfig } from "../mongo.config";
import { IMessage, MessageSchema } from "../models/message.model";
import { Model } from "mongoose";
import { TYPES } from "../../../application/dependencyInjection/container.types";

@injectable()
export class MessageRepository implements IMessageRepository {
  private readonly _messageModel: Model<IMessage>;

  constructor(@inject(TYPES.MongooseConfig) _dbContext: MongooseConfig) {
    this._messageModel = _dbContext.connection.model<IMessage>("Messages", MessageSchema, "Messages");
  }

  public async getMessagesByMatchId(matchId: bigint): Promise<Message[] | null> {
    const messages = await this._messageModel.find({ matchId }).sort({ timestamp: 1 }).exec();

		if (messages == null || messages.length === 0) {
			return null;
		}

    return messages.map((message) => this.toEntity(message));
  }

  public async createMessage(message: Message): Promise<Message | null> {
		try {

			const createdMessage = await this._messageModel.create(message);

			return this.toEntity(createdMessage);

		}catch (error) {

			return null;
		}

  }

  public async deleteMessage(messageId: bigint): Promise<void> {
    await this._messageModel.findOneAndDelete({ id: messageId }).exec();
  }

  private toEntity(dbData: IMessage): Message {
    const { id, senderId, matchId, content, timestamp } = dbData;

    return new Message(senderId, content, matchId, timestamp, id);
  }
}
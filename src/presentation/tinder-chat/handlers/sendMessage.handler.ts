import { inject, injectable } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { IMessageService } from "../../../application/interfaces/services/message.service.interface";
import { Socket } from "socket.io";

@injectable()
export class SendMessageHandler {

	constructor(@inject(TYPES.IMessageService) private _messageService: IMessageService) { }

	register(socket: Socket) {
		socket.on("sendMessage", async (message: {chatId: string, content: string}) => {
			const senderId = socket.data.userId;

			const saveResult = await this._messageService.createMessage(senderId, BigInt(message.chatId), message.content);

			if (saveResult.isErr()) {
				return socket.emit("error", saveResult.error);
			}

			socket.to(message.chatId).emit("receiveMessage", { senderId, content: message.content });
		});
	}
}
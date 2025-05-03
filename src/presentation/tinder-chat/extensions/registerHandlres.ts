import { JoinChatHandler } from "../handlers/joinChat.handler";
import { SendMessageHandler } from "../handlers/sendMessage.handler";
import { container } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { Socket } from "socket.io";

export const registerSocketHandlers = (socket: Socket) => {
	const joinChatHandler = container.resolve<JoinChatHandler>(TYPES.JoinChatHandler);
	joinChatHandler.register(socket);

	const sendMessageHandler = container.resolve<SendMessageHandler>(TYPES.SendMessageHandler);
	sendMessageHandler.register(socket);
};
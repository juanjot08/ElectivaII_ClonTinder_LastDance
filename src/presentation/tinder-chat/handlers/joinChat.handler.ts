import { Socket } from "socket.io";
import { inject, injectable } from "tsyringe";
import { IMatchService } from "../../../application/interfaces/services/match.service.interface";
import { TYPES } from "../../../application/dependencyInjection/container.types";

@injectable()
export class JoinChatHandler {

	constructor(@inject(TYPES.IMatchService) private matchService: IMatchService) { }

	register(socket: Socket) {
		socket.on("joinChat", async (content: { otherUserId: string }) => {
			const userId = socket.data.userId;

			const match = await this.matchService.getMatch(userId, BigInt(content.otherUserId));

			if (match.isErr())
				return socket.emit("error", match.error);

			const roomId = match.value.id.toString();
			socket.join(roomId);

			socket.emit("joined", { roomId });
		});
	}
}
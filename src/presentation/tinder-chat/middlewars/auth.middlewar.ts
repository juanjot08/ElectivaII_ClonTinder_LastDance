// src/sockets/middleware/auth.middleware.ts
import { Socket } from "socket.io";
import { inject, injectable } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { IAuthService } from "../../../application/interfaces/services/auth.service.interface";

@injectable()
class AuthMiddleware {

	constructor(@inject(TYPES.IAuthService) private _authService: IAuthService) { }

	public authenticateSocket(socket: Socket, next: (err?: Error) => void) {
		const header = socket.handshake.headers.authorization;

		if (!header || !header.startsWith("Bearer ")) {
			return next(new Error("Access denied. Token not provided."));
		}

		const token = header.split(' ')[1];

		const decoded = this._authService.validateToken(token);

		if (decoded.isErr()) {
			console.log(decoded.error);

			return next(new Error(decoded.error));
		}

		socket.data.userId = decoded.value.toString();

		next();
	}

}

export default AuthMiddleware;
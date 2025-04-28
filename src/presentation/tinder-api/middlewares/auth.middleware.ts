import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { TYPES } from '../../../application/dependencyInjection/container.types';
import { IAuthService } from '../../../application/interfaces/services/auth.service.interface';
import { ForbiddenError, UnauthorizedError } from '../controllers/base/api.hanldlederror';

@injectable()
class AuthMiddleware {

	constructor(@inject(TYPES.IAuthService) private _authService: IAuthService) { }

	public authenticateToken = (req: Request, res: Response, next: any) => {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedError('Access denied. Token not provided.');
		}

		const token = authHeader.split(' ')[1];
		const decoded = this._authService.validateToken(token);

		if (decoded.isErr()) {
			throw new ForbiddenError(decoded.error);
		}

		req.params.userId = decoded.value.toString();

		next();
	};
}

export default AuthMiddleware;

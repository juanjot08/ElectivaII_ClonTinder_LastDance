import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { TYPES } from '../../../application/dependencyInjection/container.types';
import { IAuthService } from '../../../application/interfaces/services/auth.service.interface';

@injectable()
class AuthMiddleware {

    constructor(@inject(TYPES.IAuthService) private _authService: IAuthService) { }

    public authenticateToken = (req: Request, res: Response, next: any) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Access denied. Token not provided.' });

            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = this._authService.validateToken(token);

        if (decoded.isErr()) {
					
            res.status(403).json({ error: decoded.error });
            return;
        }

        req.params.userId = decoded.value.toString();

        next();
    };
}

export default AuthMiddleware;

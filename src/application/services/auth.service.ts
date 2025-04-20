import { injectable } from "tsyringe";
import { IAuthService } from "../interfaces/services/auth.service.interface";
import jwt from "jsonwebtoken";
import appsettings from "../../appsettings.json"
import { StringValue } from "ms";

@injectable()
export class AuthService implements IAuthService {

    public generateToken(userId: Number): string {
        const payload = {
            userId
        };

        const secret = appsettings.auth.jwtsecret;

        const options: jwt.SignOptions = {
            expiresIn: appsettings.auth.tokenexpiration as StringValue
        };

        return jwt.sign(payload, secret, options);
    }

    public validateToken(token: string): string | null {
        try {
            const secret = appsettings.auth.jwtsecret;

            const decoded = jwt.verify(token, secret) as { userId: string };

            return decoded.userId;

        } catch (error) {
            console.error('Error al validar el token:', error);
            
            return null;
        }
    }
}
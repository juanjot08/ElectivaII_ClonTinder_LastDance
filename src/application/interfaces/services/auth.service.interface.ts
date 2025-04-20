export interface IAuthService {
    generateToken(userId: Number): string;
    validateToken(token: string): string | null;
}
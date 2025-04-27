import { Identity } from "../../../domain/entities/identity";
import { Result } from "ts-results-es";
import { ICreateIdentityUserRequestDTO } from "../dtos/identity/serviceRequest/createIdentityUser.request";
import { ILoginRequestDTO } from "../dtos/identity/serviceRequest/login.request";
import { ILoginResponseDTO } from "../dtos/identity/serviceResponse/login.response";

export interface IAuthService {
    validateToken(token: string): Result<bigint, string>;
		createIdentityUser(request: ICreateIdentityUserRequestDTO): Promise<Result<string, string>>;
		validateIdentityUser(request: ILoginRequestDTO): Promise<Result<ILoginResponseDTO, string>>;
		findIdentityUserByEmail(email: string): Promise<Result<Identity, string>>;
}
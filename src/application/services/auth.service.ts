import { inject, injectable } from "tsyringe";
import { IAuthService } from "../interfaces/services/auth.service.interface";
import jwt from "jsonwebtoken";
import appsettings from "../../appsettings.json"
import { StringValue } from "ms";
import { Identity } from "../../domain/entities/identity";
import { TYPES } from "../dependencyInjection/container.types";
import { IIdentityRepository } from "../interfaces/infrastructure/identity.repository.interface";
import { IUsersService } from "../interfaces/services/users.service.interface";
import { Result, Ok, Err } from "ts-results-es";
import { ICreateIdentityUserRequestDTO } from "../interfaces/dtos/identity/serviceRequest/createIdentityUser.request";
import { ILoginRequestDTO } from "../interfaces/dtos/identity/serviceRequest/login.request";
import { ILoginResponseDTO } from "../interfaces/dtos/identity/serviceResponse/login.response";
import { CryptUtils } from "../../domain/cryptography/crypt.utils";

@injectable()
export class AuthService implements IAuthService {

	constructor(
		@inject(TYPES.IIdentityRepository) private _idenityRepository: IIdentityRepository,
		@inject(TYPES.IUserService) private _userService: IUsersService) { }

	public async createIdentityUser(identity: ICreateIdentityUserRequestDTO): Promise<Result<string, string>> {

		const identityExists = await this.findIdentityUserByEmail(identity.email);

		if (identityExists.isOk()) {
			return Err('Identity already exists');
		}

		const newIdentity = new Identity(identity.email, CryptUtils.hashPassword(identity.password), identity.authProvider);

		await this._idenityRepository.createIdentityUser(newIdentity);

		await this._userService.createInitialProfile(newIdentity.id);

		return Ok('Identity created successfully');
	}

	public async validateIdentityUser(request: ILoginRequestDTO): Promise<Result<ILoginResponseDTO, string>> {
		const idenityUser = await this.findIdentityUserByEmail(request.email);

		if (idenityUser.isErr()) {
			return idenityUser;
		}

		const user = await this._userService.getUserByIdentityId(idenityUser.value.id);

		if (user.isErr()) {
			return user;
		}
		
		if (CryptUtils.comparePassword(request.password, idenityUser.value.password)) {
			const token = this.generateToken(user.value.id);

			if (token.isErr()) {
				return token;
			}

			const response: ILoginResponseDTO = {
				token: token.value
			};

			return Ok(response);
		}

		return Err('Invalid password');
	}

	public async findIdentityUserByEmail(email: string): Promise<Result<Identity, string>> {
		const user = await this._idenityRepository.findIdentityUserByEmail(email);

		if (user === null) {
			return Err('User not found');
		}

		return Ok(user);
	}

	public validateToken(token: string): Result<bigint, string> {
		try {
			const secret = appsettings.auth.jwtsecret;

			const decoded = jwt.verify(token, secret) as { userId: bigint };

			return Ok(decoded.userId);

		} catch (error) {
			return Err('Invalid token: ' + error);
		}
	}
	
	private generateToken(userId: bigint): Result<string, string> {
		const payload = {
			userId: userId.toString()
		};

		const secret = appsettings.auth.jwtsecret;

		const options: jwt.SignOptions = {
			expiresIn: appsettings.auth.tokenexpiration as StringValue
		};

		return Ok(jwt.sign(payload, secret, options));
	}

}
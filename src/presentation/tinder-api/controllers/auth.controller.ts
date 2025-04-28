import { inject, injectable } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { IAuthService } from "../../../application/interfaces/services/auth.service.interface";
import { Request, Response } from "express";
import { ICreateIdentityUserRequestDTO } from "../../../application/interfaces/dtos/identity/serviceRequest/createIdentityUser.request";
import { ILoginRequestDTO } from "../../../application/interfaces/dtos/identity/serviceRequest/login.request";
import { sendSuccess } from "./base/success.response.handler";
import { StatusCodes } from "http-status-codes";
import { AlreadyExistsError, UnauthorizedError } from "./base/api.hanldlederror";

@injectable()
export class AuthController {

	constructor(@inject(TYPES.IAuthService) private _authService: IAuthService) { }

	public async registerUser(req: Request, res: Response): Promise<void> {
		const parsedRequest = req.body as ICreateIdentityUserRequestDTO;

		parsedRequest.authProvider = 'PasswordEmail';

		const response = await this._authService.createIdentityUser(parsedRequest);

		if (response.isErr()) {
			throw new AlreadyExistsError(response.error);
		}

		sendSuccess(res, StatusCodes.CREATED, null, response.value);
	}

	public async loginUser(req: Request, res: Response): Promise<void> {
		const parsedRequest = req.body as ILoginRequestDTO;

		const response = await this._authService.validateIdentityUser(parsedRequest);

		if (response.isErr()) {
			throw new UnauthorizedError(response.error);
		}

		sendSuccess(res, StatusCodes.OK, {token: response.value.token});
	}
}
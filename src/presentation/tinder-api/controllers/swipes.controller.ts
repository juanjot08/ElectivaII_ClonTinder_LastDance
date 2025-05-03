import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { ISwipeService } from "../../../application/interfaces/services/swipe.service.interface";
import { SwipeAction } from "../../../domain/enumerables/swipeAction.enum";
import { BadRequestError, NotFoundError } from "./base/api.hanldlederror";
import { sendSuccess } from "./base/success.response.handler";
import { StatusCodes } from "http-status-codes";

@injectable()
export class SwipesController {
	constructor(@inject(TYPES.ISwipeService) private _swipeService: ISwipeService) { }

	public async recordSwipe(req: Request, res: Response): Promise<void> {
		const { targetUserId, swipeType } = req.body;
		const { userId } = req.params;

		const swipeAction = swipeType as SwipeAction;

		const result = await this._swipeService.recordSwipe(BigInt(userId), BigInt(targetUserId), swipeAction);

		if (result.isErr()) {
			throw new BadRequestError(result.error);
		}

		sendSuccess(res, StatusCodes.OK, result.value);
	}

	public async getSwipeHistory(req: Request, res: Response): Promise<void> {
		const { userId } = req.params;

		const result = await this._swipeService.getSwipeHistory(BigInt(userId));

		sendSuccess(res, StatusCodes.OK, { swipes: result });
	}
}
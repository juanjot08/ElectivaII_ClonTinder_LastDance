import { Err, Ok, Result } from "ts-results-es";
import { SwipeAction } from "../../domain/enumerables/swipeAction.enum";
import { ISwipeActionResult } from "../interfaces/dtos/swipes/serivceResponse/swipeResult.response";
import { ISwipeService } from "../interfaces/services/swipe.service.interface";
import { inject, injectable } from "tsyringe";
import { TYPES } from "../dependencyInjection/container.types";
import { ISwipeRepository } from "../interfaces/infrastructure/swipe.repository.interface";
import { Swipe } from "../../domain/entities/swipe";
import { IMatchService } from "../interfaces/services/match.service.interface";

@injectable()
export class SwipeService implements ISwipeService {

	constructor(
		@inject(TYPES.ISwipeRepository) private _swipeRepository: ISwipeRepository,
		@inject(TYPES.IMatchService) private _matchService: IMatchService
	) { }

	public async recordSwipe(userId: bigint, targetUserId: bigint, swipeType: SwipeAction): Promise<Result<ISwipeActionResult, string>> {
		
		if (userId === targetUserId) {
			return Err("You cannot swipe on yourself.");
		}

		const existingSwipe = await this._swipeRepository.getSwipeByUserIdAndTargetId(userId, targetUserId);
		
		if (existingSwipe && existingSwipe.swipeType === swipeType) {
			return Err("You have already swiped this user.");
		}

		const newSwipe = new Swipe(userId, targetUserId, swipeType, new Date());
		
		await this._swipeRepository.recordSwipe(newSwipe);

		const swipeOfTarget = await this._swipeRepository.getSwipeByUserIdAndTargetId(targetUserId, userId);

		const isMatch = swipeOfTarget !== null 
									&& swipeOfTarget.swipeType === SwipeAction.LIKE 
									&& swipeType === SwipeAction.LIKE;

		if (isMatch) {
			await this._matchService.recordMatch(userId, targetUserId);
		}

		return Ok({ isMatch } as ISwipeActionResult);
	}

	public async getSwipeHistory(userId: bigint): Promise<Swipe[] | null> {
		const swaps = await this._swipeRepository.getSwipeHistory(userId);
		return swaps;
	}

}
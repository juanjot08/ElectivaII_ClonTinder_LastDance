import { Result } from "ts-results-es";
import { ISwipeActionResult } from "../dtos/swipes/serivceResponse/swipeResult.response";
import { SwipeAction } from "../../../domain/enumerables/swipeAction.enum";
import { Swipe } from "../../../domain/entities/swipe";

export interface ISwipeService {

	recordSwipe(userId: bigint, targetUserId: bigint, swipeType: SwipeAction): Promise<Result<ISwipeActionResult, string>>;
	getSwipeHistory(userId: bigint): Promise<Swipe[] | null>;
}
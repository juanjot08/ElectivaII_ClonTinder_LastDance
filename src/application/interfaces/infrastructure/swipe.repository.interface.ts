import { Swipe } from "../../../domain/entities/swipe";
import { SwipeAction } from "../../../domain/enumerables/swipeAction.enum";

export interface ISwipeRepository {

	recordSwipe(swipe: Swipe): Promise<void>;
	getSwipeHistory(userId: bigint): Promise<Swipe[] | null>;
	getSwipeByUserIdAndTargetId(userId: bigint, targetUserId: bigint): Promise<Swipe | null>;
}
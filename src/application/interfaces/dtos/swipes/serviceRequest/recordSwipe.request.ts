import { SwipeAction } from "../../../../../domain/enumerables/swipeAction.enum";

export interface IRecordSwipeRequest {
		userId: bigint;
		targetUserId: bigint;
		swipeType: SwipeAction;
}
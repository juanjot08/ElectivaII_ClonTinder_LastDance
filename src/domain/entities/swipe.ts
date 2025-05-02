import { SwipeAction } from "../enumerables/swipeAction.enum";

export class Swipe {
		constructor(
				public userId: bigint,
				public targetUserId: bigint,
				public swipeType: SwipeAction,
				public timestamp: Date
		) {}
}
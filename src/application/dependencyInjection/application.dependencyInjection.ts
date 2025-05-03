import { DependencyContainer } from "tsyringe";
import { IUsersService } from "../interfaces/services/users.service.interface";
import { IAuthService } from "../interfaces/services/auth.service.interface";
import { ISwipeService } from "../interfaces/services/swipe.service.interface";
import { IMatchService } from "../interfaces/services/match.service.interface";
import { TYPES } from "./container.types";
import { UsersService } from "../services/users.service";
import { AuthService } from "../services/auth.service";
import { SwipeService } from "../services/swipe.service";
import { MatchService } from "../services/match.service";
import { IMessageService } from "../interfaces/services/message.service.interface";
import { MessageService } from "../services/message.service";

export class ApplicationDependencyInjection {

	public static RegisterServices(container: DependencyContainer) {

		container.register<IUsersService>(TYPES.IUserService, { useClass: UsersService });
		container.register<IAuthService>(TYPES.IAuthService, { useClass: AuthService });
		container.register<ISwipeService>(TYPES.ISwipeService, { useClass: SwipeService });
		container.register<IMatchService>(TYPES.IMatchService, { useClass: MatchService });
		container.register<IMessageService>(TYPES.IMessageService, { useClass: MessageService });
	}
}
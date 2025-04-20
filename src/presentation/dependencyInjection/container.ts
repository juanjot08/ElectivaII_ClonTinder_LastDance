import UserController from "../tinder-api/controllers/users.controller";
import MessagesController from "../tinder-api/controllers/messages.controller";
import { container, Lifecycle } from "tsyringe";
import { TYPES } from "../../application/dependencyInjection/container.types";
import { UserRouter } from "../tinder-api/routes/user.router";
import { MessagesRouter } from "../tinder-api/routes/messages.router";
import { SwipesRouter } from "../tinder-api/routes/swipes.router";
import { SwipesController } from "../tinder-api/controllers/swipes.controller";
import { MatchController } from "../tinder-api/controllers/match.controller";
import { MatchRouter } from "../tinder-api/routes/match.router";
import { IUsersService } from "../../application/interfaces/services/users.service.interface";
import { UsersService } from "../../application/services/users.service";
import { IUsersRepository } from "../../application/interfaces/infrastructure/users.repository.interface";
import { UsersRepository } from "../../infrastructure/mongo/repositories/users.repository";
import { MongooseConfig } from "../../infrastructure/mongo/mongo.config";
import { IAuthService } from "../../application/interfaces/services/auth.service.interface";
import { AuthService } from "../../application/services/auth.service";

// Infrastructure
container.register<MongooseConfig>(TYPES.MongooseConfig, { useClass: MongooseConfig }, { lifecycle: Lifecycle.Singleton });
container.register<IUsersRepository>(TYPES.IUserRepository, { useClass: UsersRepository });

// Application
container.register<IUsersService>(TYPES.IUserService, { useClass: UsersService });
container.register<IAuthService>(TYPES.IAuthService, { useClass: AuthService });

// Presentation
container.register<UserRouter>(TYPES.UserRouter, { useClass: UserRouter });
container.register<MessagesRouter>(TYPES.MessagesRouter, { useClass: MessagesRouter });
container.register<SwipesRouter>(TYPES.SwipesRouter, { useClass: SwipesRouter });
container.register<MatchRouter>(TYPES.MatchRouter, { useClass: MatchRouter });

container.register<UserController>(TYPES.UserController, { useClass: UserController });
container.register<MessagesController>(TYPES.MessagesController, { useClass: MessagesController });
container.register<SwipesController>(TYPES.SwipesController, { useClass: SwipesController });
container.register<MatchController>(TYPES.MatchController, { useClass: MatchController });

export default container;
import UserController from "../controllers/users.controller";
import MessagesController from "../controllers/messages.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
import { container } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { UserRouter } from "../routes/user.router";
import { MessagesRouter } from "../routes/messages.router";
import { SwipesRouter } from "../routes/swipes.router";
import { SwipesController } from "../controllers/swipes.controller";
import { MatchController } from "../controllers/match.controller";
import { MatchRouter } from "../routes/match.router";
import { AuthRouter } from "../routes/auth.router";
import { AuthController } from "../controllers/auth.controller";
import { ApplicationDependencyInjection } from "../../../application/dependencyInjection/application.dependencyInjection";
import { InfrastructureDependencyInjection } from "../../../infrastructure/dependencyInjection/infrastructure.dependencyInjection";


// Infrastructure
InfrastructureDependencyInjection.RegisterRepositories(container);

// Application
ApplicationDependencyInjection.RegisterServices(container);

// Presentation
container.register<UserRouter>(TYPES.UserRouter, { useClass: UserRouter });
container.register<MessagesRouter>(TYPES.MessagesRouter, { useClass: MessagesRouter });
container.register<SwipesRouter>(TYPES.SwipesRouter, { useClass: SwipesRouter });
container.register<MatchRouter>(TYPES.MatchRouter, { useClass: MatchRouter });
container.register<AuthRouter>(TYPES.AuthRouter, { useClass: AuthRouter });

container.register<UserController>(TYPES.UserController, { useClass: UserController });
container.register<MessagesController>(TYPES.MessagesController, { useClass: MessagesController });
container.register<SwipesController>(TYPES.SwipesController, { useClass: SwipesController });
container.register<MatchController>(TYPES.MatchController, { useClass: MatchController });
container.register<AuthController>(TYPES.AuthController, { useClass: AuthController });

container.register<AuthMiddleware>(TYPES.AuthMiddleware, { useClass: AuthMiddleware });

export default container;
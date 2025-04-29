import UserController from "../tinder-api/controllers/users.controller";
import MessagesController from "../tinder-api/controllers/messages.controller";
import AuthMiddleware from "../tinder-api/middlewares/auth.middleware";
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
import { AuthRouter } from "../tinder-api/routes/auth.router";
import { AuthController } from "../tinder-api/controllers/auth.controller";
import { IIdentityRepository } from "../../application/interfaces/infrastructure/identity.repository.interface";
import { IdentityRepository } from "../../infrastructure/mongo/repositories/identity.repository";
import { IUserImagesRepository } from "../../application/interfaces/infrastructure/user.images.repository";
import { UserImagesRepository } from "../../infrastructure/blobstorage/users/user.images.repository";
import appsettings from '../../appsettings.json';
import { AzureBlobStorageAdapter } from "../../infrastructure/blobstorage/common/azureblobstorage.adapter";


// Infrastructure
container.register<MongooseConfig>(TYPES.MongooseConfig, { useClass: MongooseConfig }, { lifecycle: Lifecycle.Singleton });
container.register(TYPES.BlobStorageConnectionString, { useValue: appsettings.blobStorage.connectionString });

container.register<AzureBlobStorageAdapter>(TYPES.BlobStorageClient,
	{ useClass: AzureBlobStorageAdapter },
	{ lifecycle: Lifecycle.Singleton });

container.register<IUsersRepository>(TYPES.IUserRepository, { useClass: UsersRepository });
container.register<IIdentityRepository>(TYPES.IIdentityRepository, { useClass: IdentityRepository });
container.register<IUserImagesRepository>(TYPES.IUserImagesRepository, { useClass: UserImagesRepository });

// Application
container.register<IUsersService>(TYPES.IUserService, { useClass: UsersService });

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
container.register<IAuthService>(TYPES.IAuthService, { useClass: AuthService });

export default container;
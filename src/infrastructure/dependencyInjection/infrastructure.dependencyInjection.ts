import { DependencyContainer, Lifecycle } from "tsyringe";
import { TYPES } from "../../application/dependencyInjection/container.types";
import { MongooseConfig } from "../mongo/mongo.config";
import { AzureBlobStorageAdapter } from "../blobstorage/common/azureblobstorage.adapter";
import { IUsersRepository } from "../../application/interfaces/infrastructure/users.repository.interface";
import { IIdentityRepository } from "../../application/interfaces/infrastructure/identity.repository.interface";
import { IMatchRepository } from "../../application/interfaces/infrastructure/match.repository.interface";
import { ISwipeRepository } from "../../application/interfaces/infrastructure/swipe.repository.interface";
import { IUserImagesRepository } from "../../application/interfaces/infrastructure/user.images.repository";
import { UsersRepository } from "../mongo/repositories/users.repository";
import { IdentityRepository } from "../mongo/repositories/identity.repository";
import { MatchRepository } from "../mongo/repositories/match.repository";
import { SwipeRepository } from "../mongo/repositories/swipe.repository";
import { UserImagesRepository } from "../blobstorage/users/user.images.repository";
import appsettings from '../../appsettings.json'
import { IMessageRepository } from "../../application/interfaces/infrastructure/message.repository.interface";
import { MessageRepository } from "../mongo/repositories/message.repository";


export class InfrastructureDependencyInjection {

	public static async RegisterMongoDb(container: DependencyContainer, connection: string, databaseName: string) {

		container.register<MongooseConfig>(TYPES.MongooseConfig, { useClass: MongooseConfig }, { lifecycle: Lifecycle.Singleton });

		await container.resolve<MongooseConfig>(TYPES.MongooseConfig)
			.connect(connection, databaseName)
			.catch((error) => {
				console.error('Failed to connect to MongoDB:', error);
				process.exit(1);
			});
	}

	public static RegisterRepositories(container: DependencyContainer) {
		
		container.register(TYPES.BlobStorageConnectionString, { useValue: appsettings.blobStorage.connectionString });
		container.register<AzureBlobStorageAdapter>(TYPES.BlobStorageClient,
			{ useClass: AzureBlobStorageAdapter },
			{ lifecycle: Lifecycle.Singleton });
		
		container.register<IUsersRepository>(TYPES.IUserRepository, { useClass: UsersRepository });
		container.register<IIdentityRepository>(TYPES.IIdentityRepository, { useClass: IdentityRepository });
		container.register<IMatchRepository>(TYPES.IMatchRepository, { useClass: MatchRepository });
		container.register<ISwipeRepository>(TYPES.ISwipeRepository, { useClass: SwipeRepository });
		container.register<IUserImagesRepository>(TYPES.IUserImagesRepository, { useClass: UserImagesRepository });
		container.register<IMessageRepository>(TYPES.IMessageRepository, { useClass: MessageRepository });
	}
}
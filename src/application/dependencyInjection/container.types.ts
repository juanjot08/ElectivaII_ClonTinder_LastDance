import { SendMessageHandler } from "../../presentation/tinder-chat/handlers/sendMessage.handler";

export const TYPES = {
    UserRouter: Symbol.for('UserRouter'),
    SwipesRouter: Symbol.for('SwipesRouter'),
    MessagesRouter: Symbol.for('MessagesRouter'),
    MatchRouter: Symbol.for('MatchRouter'),
    AuthRouter: Symbol.for('AuthRouter'),

    AuthMiddleware: Symbol.for('AuthMiddleware'),

		JoinChatHandler: Symbol.for('JoinChatHandler'),
		SendMessageHandler: Symbol.for('SendMessageHandler'),

    UserController: Symbol.for('UserController'),
    MessagesController: Symbol.for('MessagesController'),
    SwipesController: Symbol.for('SwipesController'),
    MatchController: Symbol.for('MatchController'),
    AuthController: Symbol.for('AuthController'),

    IUserService: Symbol.for('IUserService'),
    IAuthService: Symbol.for('IAuthService'),
		ISwipeService: Symbol.for('ISwipeService'),
		IMatchService: Symbol.for('IMatchService'),
		IMessageService: Symbol.for('IMessageService'),

    IUserRepository: Symbol.for('IUserRepository'),
		IIdentityRepository: Symbol.for('IIdentityRepository'),
		ISwipeRepository: Symbol.for('ISwipeRepository'),
		IMatchRepository: Symbol.for('IMatchRepository'),
		IUserImagesRepository: Symbol.for('IUserImagesRepository'),
		IMessageRepository: Symbol.for('IMessageRepository'),
    MongooseConfig: Symbol.for('MongooseConfig'),
		BlobStorageConnectionString: Symbol.for('BlobStorageConnectionString'),
		BlobStorageClient: Symbol.for('BlobStorageClient'),
};
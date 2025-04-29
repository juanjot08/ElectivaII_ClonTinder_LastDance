export const TYPES = {
    UserRouter: Symbol.for('UserRouter'),
    SwipesRouter: Symbol.for('SwipesRouter'),
    MessagesRouter: Symbol.for('MessagesRouter'),
    MatchRouter: Symbol.for('MatchRouter'),
    AuthRouter: Symbol.for('AuthRouter'),

    AuthMiddleware: Symbol.for('AuthMiddleware'),

    UserController: Symbol.for('UserController'),
    MessagesController: Symbol.for('MessagesController'),
    SwipesController: Symbol.for('SwipesController'),
    MatchController: Symbol.for('MatchController'),
    AuthController: Symbol.for('AuthController'),

    IUserService: Symbol.for('IUserService'),
    IAuthService: Symbol.for('IAuthService'),

    IUserRepository: Symbol.for('IUserRepository'),
		IIdentityRepository: Symbol.for('IIdentityRepository'),
		IUserImagesRepository: Symbol.for('IUserImagesRepository'),
    MongooseConfig: Symbol.for('MongooseConfig'),
		BlobStorageConnectionString: Symbol.for('BlobStorageConnectionString'),
		BlobStorageClient: Symbol.for('BlobStorageClient'),
};
export const TYPES = {
    UserRouter: Symbol.for('UserRouter'),
    SwipesRouter: Symbol.for('SwipesRouter'),
    MessagesRouter: Symbol.for('MessagesRouter'),
    MatchRouter: Symbol.for('MatchRouter'),

    UserController: Symbol.for('UserController'),
    MessagesController: Symbol.for('MessagesController'),
    SwipesController: Symbol.for('SwipesController'),
    MatchController: Symbol.for('MatchController'),

    IUserService: Symbol.for('IUserService'),

    IUserRepository: Symbol.for('IUserRepository'),
    MongooseConfig: Symbol.for('MongooseConfig'),
};
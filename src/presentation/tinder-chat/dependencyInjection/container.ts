import { container, Lifecycle } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import AuthMiddleware from "../middlewars/auth.middlewar";
import { JoinChatHandler } from "../handlers/joinChat.handler";
import { SendMessageHandler } from "../handlers/sendMessage.handler";
import { InfrastructureDependencyInjection } from "../../../infrastructure/dependencyInjection/infrastructure.dependencyInjection";
import { ApplicationDependencyInjection } from "../../../application/dependencyInjection/application.dependencyInjection";

// Infrastructure
InfrastructureDependencyInjection.RegisterRepositories(container);

// Application
ApplicationDependencyInjection.RegisterServices(container);

container.register<JoinChatHandler>(TYPES.JoinChatHandler, { useClass: JoinChatHandler });
container.register<SendMessageHandler>(TYPES.SendMessageHandler, { useClass: SendMessageHandler });

container.register<AuthMiddleware>(TYPES.AuthMiddleware, { useClass: AuthMiddleware });

export default container;
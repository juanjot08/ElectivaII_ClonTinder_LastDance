import "reflect-metadata";
import { Server, Socket } from 'socket.io';
import container from './dependencyInjection/container';
import AuthMiddleware from './middlewars/auth.middlewar';
import { TYPES } from '../../application/dependencyInjection/container.types';
import { registerSocketHandlers } from './extensions/registerHandlres';
import { InfrastructureDependencyInjection } from "../../infrastructure/dependencyInjection/infrastructure.dependencyInjection";
import appsettings from '../../appsettings.json'
import { AppExtensions } from "./extensions/app.extensions";

const CHAT_PORT = 4000;

const io = new Server({
  cors: {
    origin: '*',
  },
  connectionStateRecovery: {}
});

AppExtensions.registerInitialConfigurations();

InfrastructureDependencyInjection.RegisterMongoDb(container, appsettings.mongodb.connection, appsettings.mongodb.databaseName);

const authMiddleware = container.resolve<AuthMiddleware>(TYPES.AuthMiddleware);
io.use((socket: Socket, next) => authMiddleware.authenticateSocket(socket, next));

io.on("connection", (socket: Socket) => {
	console.log("User connected:", socket.data.userId);
	
	registerSocketHandlers(socket);

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.data.userId);
	});
});

io.listen(CHAT_PORT);
console.log(`Service chat running on ws://localhost:${CHAT_PORT}`);
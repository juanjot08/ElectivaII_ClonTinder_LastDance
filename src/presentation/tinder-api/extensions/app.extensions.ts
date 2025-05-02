import { DependencyContainer } from "tsyringe";
import { UserRouter } from "../routes/user.router";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { MatchRouter } from "../routes/match.router";
import { SwipesRouter } from "../routes/swipes.router";
import { AuthRouter } from "../routes/auth.router";
import { MessagesRouter } from "../routes/messages.router";
import { errorHandler } from "../middlewares/error.handler.middleware";
import { NextFunction, Request, Response } from "express";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Id } from "../../../domain/valueObjects/id";

export class AppExtensions {

	public static registerRoutes(container: DependencyContainer, app: any) {

		// Middleware to log requests
		app.use((req: Request, res: Response, next: NextFunction) => {
			console.log(`${req.method} request for ${req.url}`);
			next();
		});

		const userRouter = container.resolve<UserRouter>(TYPES.UserRouter);
		app.use('/api/users', userRouter.router);

		const matchRouter = container.resolve<MatchRouter>(TYPES.MatchRouter)
		app.use('/api/matches', matchRouter.router);

		const swipesRouter = container.resolve<SwipesRouter>(TYPES.SwipesRouter);
		app.use('/api/swipes', swipesRouter.router);

		const authRouter = container.resolve<AuthRouter>(TYPES.AuthRouter);
		app.use('/api/auth', authRouter.router);

		const messagesRouter = container.resolve<MessagesRouter>(TYPES.MessagesRouter)
		app.use('/api/messages', messagesRouter.router);


		// This have to be the last middleware
		app.use(errorHandler);
	}

	public static registerInitialConfigurations() {
		const assignedWorkerId = parseInt(process.env.WORKER_ID || '0', 10);
		Id.configure({ workerId: assignedWorkerId });
	}

	public static registerSwagger(app: any) {
		const swaggerOptions = {
			swaggerDefinition: {
				openapi: "3.0.0",
				info: {
					title: "Clon Tinder",
					version: "1.0.0",
					description: "Documentación Clon Tinder",
				},
				servers: [
					{
						url: "http://localhost:3000/api"
					}
				],
				components: {
					securitySchemes: {
						bearerAuth: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'JWT',
						},
					},
				},
			},
			apis: [
				"./src/presentation/tinder-api/routes/*.ts"
			]
		};

		const swaggerDocs = swaggerJSDoc(swaggerOptions);
		app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
	}

}
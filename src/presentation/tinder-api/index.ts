import "reflect-metadata";
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { UserRouter } from './routes/user.router';
import { MatchRouter } from './routes/match.router';
import { SwipesRouter } from './routes/swipes.router';
import authRouter from './routes/auth.router';
import { MessagesRouter } from './routes/messages.router';
import container from '../dependencyInjection/container';
import { TYPES } from '../../application/dependencyInjection/container.types';
import appsettings from '../../appsettings.json'
import { InfrastructureDependencyInjection } from '../../infrastructure/dependencyInjection/infrastructure.dependencyInjection'

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

InfrastructureDependencyInjection.RegisterMongoDb(container, appsettings.mongodb.connection, appsettings.mongodb.databaseName);

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Clon Tinder",
            version: "1.0.0",
            description: "Documentación Clon Tinder",
            servers: [
                {
                    url: "http://localhost:3000/api"
                }
            ]
        }
    },
    apis: [
        "./src/presentation/tinder-api/routes/*.ts"
    ]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const userRouter = container.resolve<UserRouter>(TYPES.UserRouter);
app.use('/api/users', userRouter.router);

const matchRouter = container.resolve<MatchRouter>(TYPES.MatchRouter)
app.use('/api/match', matchRouter.router);

const swipesRouter = container.resolve<SwipesRouter>(TYPES.SwipesRouter);
app.use('/api/swipes', swipesRouter.router);

app.use('/api/auth', authRouter);

const messagesRouter = container.resolve<MessagesRouter>(TYPES.MessagesRouter)
app.use('/api/messages', messagesRouter.router);


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
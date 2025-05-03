import "reflect-metadata";
import './extensions/global.extensions';
import express from 'express';
import appsettings from '../../appsettings.json';
import container from './dependencyInjection/container';
import { InfrastructureDependencyInjection } from '../../infrastructure/dependencyInjection/infrastructure.dependencyInjection';
import { AppExtensions } from "./extensions/app.extensions";
import cors from "cors";

const app = express();
const port = appsettings.server.port || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "*", 
  credentials: true,
}));

InfrastructureDependencyInjection.RegisterMongoDb(container, appsettings.mongodb.connection, appsettings.mongodb.databaseName);

AppExtensions.registerInitialConfigurations();

AppExtensions.registerSwagger(app);

AppExtensions.registerRoutes(container, app);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
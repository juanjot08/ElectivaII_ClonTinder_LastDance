import { DependencyContainer } from "tsyringe";
import { TYPES } from "../../application/dependencyInjection/container.types";
import { MongooseConfig } from "../mongo/mongo.config";


export class InfrastructureDependencyInjection {

    public static async RegisterMongoDb(container: DependencyContainer, connection: string, databaseName: string) {

        await container.resolve<MongooseConfig>(TYPES.MongooseConfig)
                .connect(connection, databaseName)
                .catch((error) => {
                    console.error('Failed to connect to MongoDB:', error);
                    process.exit(1);
                });
    }

}
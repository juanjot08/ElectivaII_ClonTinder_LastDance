import { injectable, singleton } from 'tsyringe';
import mongoose from 'mongoose';

@injectable()
export class MongooseConfig {
  private isConnected: boolean = false;

  public async connect(uri: string, databaseName: string): Promise<void> {
    if (!this.isConnected) {
      try {
        await mongoose.connect(uri, { dbName: databaseName });

        console.log('Connected to MongoDB');

        this.isConnected = true;
      } catch (error) {

        console.error('Error connecting to MongoDB:', error);

        throw error;
      }
    }
  }

  public get connection(): typeof mongoose {
    return mongoose;
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        this.isConnected = false;
      } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        throw error;
      }
    }
  }
}
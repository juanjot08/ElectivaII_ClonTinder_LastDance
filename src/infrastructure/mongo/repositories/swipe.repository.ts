import { inject, injectable } from "tsyringe";
import { Model } from "mongoose";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { ISwipeRepository } from "../../../application/interfaces/infrastructure/swipe.repository.interface";
import { Swipe } from "../../../domain/entities/swipe";
import { SwipeAction } from "../../../domain/enumerables/swipeAction.enum";
import { MongooseConfig } from "../mongo.config";
import { ISwipe, SwipeSchema } from "../models/swipe.model";

@injectable()
export class SwipeRepository implements ISwipeRepository {
  private readonly _swipeModel: Model<ISwipe>;

  constructor(@inject(TYPES.MongooseConfig) private _dbContext: MongooseConfig) {
    this._swipeModel = _dbContext.connection.model<ISwipe>("Swipes", SwipeSchema, "Swipes");
  }

  public async recordSwipe(swipe: Swipe): Promise<void> {
    await this._swipeModel.create(swipe);
  }

  public async getSwipeHistory(userId: bigint): Promise<Swipe[] | null> {
    const swipes = await this._swipeModel.find({ userId });

    if (!swipes || swipes.length === 0) {
      return null;
    }

    return swipes.map((swipe) => this.toEntity(swipe));
  }

  public async getSwipeByUserIdAndTargetId(
    userId: bigint,
    targetUserId: bigint
  ): Promise<Swipe | null> {
    const swipe = await this._swipeModel.findOne({ userId, targetUserId });

    if (!swipe) {
      return null;
    }

    return this.toEntity(swipe);
  }

  private toEntity(dbData: ISwipe): Swipe {
    const { userId, targetUserId, swipeType, timestamp } = dbData;

    return new Swipe(userId, targetUserId, swipeType, timestamp);
  }
}
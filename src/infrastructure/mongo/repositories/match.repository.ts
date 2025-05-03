import { inject, injectable } from "tsyringe";
import { Model } from "mongoose";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { IMatchRepository } from "../../../application/interfaces/infrastructure/match.repository.interface";
import { Match } from "../../../domain/entities/match";
import { MongooseConfig } from "../mongo.config";
import { IMatch, MatchSchema } from "../models/match.model";

@injectable()
export class MatchRepository implements IMatchRepository {
  private readonly _matchModel: Model<IMatch>;

  constructor(@inject(TYPES.MongooseConfig) _dbContext: MongooseConfig) {
    this._matchModel = _dbContext.connection.model<IMatch>("Matches", MatchSchema, "Matches");
  }
	
	public async getMatch(userId: bigint, targetUserId: bigint): Promise<Match | null> {
		const match = await this._matchModel.findOne({ userId, targetUserId });

		if (match == null) {
			return null;
		}

		return this.toEntity(match);
	}

  public async recordMatch(match: Match): Promise<void> {
    await this._matchModel.create(match);
  }

  public async getMatchHistory(userId: bigint): Promise<Match[] | null> {
    const matches = await this._matchModel.find({ userId });

    if (!matches || matches.length === 0) {
      return null;
    }

    return matches.map((match) => this.toEntity(match));
  }

  private toEntity(dbData: IMatch): Match {
    const { id, userId, targetUserId, createdAt } = dbData;

    return new Match(userId, targetUserId, createdAt, id);
  }
}
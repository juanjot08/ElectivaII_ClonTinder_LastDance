import { inject, injectable } from "tsyringe";
import { IMatchService } from "../interfaces/services/match.service.interface";
import { TYPES } from "../dependencyInjection/container.types";
import { IMatchRepository } from "../interfaces/infrastructure/match.repository.interface";
import { Err, Ok, Result } from "ts-results-es";
import { Match } from "../../domain/entities/match";

@injectable()
export class MatchService implements IMatchService {

	constructor(@inject(TYPES.IMatchRepository) private _matchRepository: IMatchRepository) { }

	public async recordMatch(userId: bigint, targetUserId: bigint): Promise<void> {
		const newMatch = new Match(userId, targetUserId, new Date());

		await this._matchRepository.recordMatch(newMatch);
	}

	public async getMatchHistory(userId: bigint): Promise<Result<Match[], string>> {
		const matchHistory = await this._matchRepository.getMatchHistory(userId);

		if (matchHistory == null) {
			return Err("Match history not found.");
		}

		return Ok(matchHistory);
	}
}
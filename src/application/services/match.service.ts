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

		const newComplementMatch = new Match(targetUserId, userId, newMatch.createdAt, newMatch.id);
		
		await this._matchRepository.recordMatch(newMatch);

		await this._matchRepository.recordMatch(newComplementMatch);
	}
	
	public async getMatchHistory(userId: bigint): Promise<Result<Match[], string>> {
		const matchHistory = await this._matchRepository.getMatchHistory(userId);
		
		if (matchHistory == null) {
			return Err("Match history not found.");
		}
		
		return Ok(matchHistory);
	}

	public async getMatch(userId: bigint, targetUserId: bigint): Promise<Result<Match, string>> {
		const match = await this._matchRepository.getMatch(userId, targetUserId);

		if (match == null) {
			return Err("Match not found.");
		}

		return Ok(match);
	}
}
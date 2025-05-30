import { Result } from "ts-results-es";
import { Match } from "../../../domain/entities/match";

export interface IMatchService {
	recordMatch(userId: bigint, targetUserId: bigint): Promise<void>;
	getMatchHistory(userId: bigint): Promise<Result<any[], string>>;
	getMatch(userId: bigint, targetUserId: bigint): Promise<Result<Match, string>>;
}
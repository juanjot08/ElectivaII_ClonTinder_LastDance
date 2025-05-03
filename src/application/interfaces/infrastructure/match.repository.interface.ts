import { Match } from "../../../domain/entities/match";

export interface IMatchRepository {
	recordMatch(match: Match): Promise<void>;
	getMatchHistory(userId: bigint): Promise<Match[] | null>;
	getMatch(userId: bigint, targetUserId: bigint): Promise<Match | null>;
}
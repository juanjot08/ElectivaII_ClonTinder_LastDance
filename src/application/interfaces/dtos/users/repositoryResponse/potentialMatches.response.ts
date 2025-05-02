import { User } from "../../../../../domain/entities/user";
import { IUserResponseDTO } from "../serviceResponse/user.response";

export interface FindPotentialMatchesResult {
	users: IUserResponseDTO[] | null;
	nextCursor: { lastId: bigint | null };
}
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { IMatchService } from "../../../application/interfaces/services/match.service.interface";
import { NotFoundError } from "./base/api.hanldlederror";
import { sendSuccess } from "./base/success.response.handler";
import { StatusCodes } from "http-status-codes";

@injectable()
export class MatchController {
  constructor(@inject(TYPES.IMatchService) private _matchService: IMatchService) {}

  public async getMatchHistory(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    const result = await this._matchService.getMatchHistory(BigInt(userId));

    if (result.isErr()) {
      throw new NotFoundError(result.error);
    }

    sendSuccess(res, StatusCodes.OK, { matches: result.value });
  }
}
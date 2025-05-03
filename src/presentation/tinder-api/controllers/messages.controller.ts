import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IMessageService } from '../../../application/interfaces/services/message.service.interface';
import { TYPES } from '../../../application/dependencyInjection/container.types';
import { BadRequestError, NotFoundError } from './base/api.hanldlederror';
import { sendSuccess } from './base/success.response.handler';
import { StatusCodes } from 'http-status-codes';

@injectable()
class MessagesController {
  constructor(@inject(TYPES.IMessageService) private _messageService: IMessageService) {}

  public async getMessagesByMatchId(req: Request, res: Response): Promise<void> {
    const { matchId } = req.params;

		console.log(req.query)

    const messages = await this._messageService.getMessagesByMatchId(BigInt(matchId!.toString()));

    if (messages.isErr()) {
      throw new NotFoundError(messages.error);
    }

    sendSuccess(res, StatusCodes.OK, messages.value);
  }
}

export default MessagesController;
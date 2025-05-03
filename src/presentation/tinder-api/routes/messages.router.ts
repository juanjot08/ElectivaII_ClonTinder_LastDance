import { Router } from 'express';
import { inject, injectable } from 'tsyringe'
import { TYPES } from '../../../application/dependencyInjection/container.types';
import MessagesController from '../controllers/messages.controller';

@injectable()
export class MessagesRouter {
	public router: Router;

	constructor(@inject(TYPES.MessagesController) private messagesController: MessagesController) {
		this.router = Router();
		this.initializeRoutes();
	}

	private initializeRoutes(): void {

		/**
		 * @swagger
		 * /messages/{matchId}:
		 *   get:
		 *     summary: Get chat messages
		 *     description: Retrieves the chat messages between the authenticated user and a match.
		 *     tags: [Messages]
		 *     parameters:
		 *       - in: path
		 *         name: matchId
		 *         required: true
		 *         schema:
		 *           type: string
		 *         description: The ID of the match.
		 *     responses:
		 *       200:
		 *         description: Chat messages retrieved successfully.
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 messages:
		 *                   type: array
		 *                   items:
		 *                     type: object
		 *                     properties:
		 *                       id:
		 *                         type: number
		 *                         example: "98765"
		 *                       senderId:
		 *                         type: number
		 *                         example: "12345"
		 *                       matchId:
		 *                         type: number
		 *                         example: "12345"
		 *                       content:
		 *                         type: string
		 *                         example: "Hey! How are you?"
		 *                       timestamp:
		 *                         type: string
		 *                         format: date-time
		 *                         example: "2025-02-28T15:00:00Z"
		 *       404:
		 *         description: Match or chat history not found.
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 error:
		 *                   type: string
		 *                   example: "Match or chat history not found."
		 *       500:
		 *         description: Internal server error.
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 error:
		 *                   type: string
		 *                   example: "Internal server error."
		 */
		this.router.get('/:matchId', this.messagesController.getMessagesByMatchId.bind(this.messagesController));
	}
}

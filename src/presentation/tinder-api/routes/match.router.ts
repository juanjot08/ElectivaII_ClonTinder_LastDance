import { Router, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { TYPES } from '../../../application/dependencyInjection/container.types';
import { MatchController } from '../controllers/match.controller';

@injectable()
export class MatchRouter {
  public router: Router;

  constructor(@inject(TYPES.MatchController)private matchController: MatchController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * /api/match:
     *   get:
     *     summary: Get matches for a user
     *     description: Retrieves all matches for the authenticated user.
     *     tags:
     *       - Match
     *     parameters:
     *       - in: query
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: The user ID
     *     responses:
     *       200:
     *         description: List of matches.
     *       404:
     *         description: No matches found.
     */
    this.router.get('/', this.matchController.getMatches);

    /**
     * @swagger
     * /api/match/{matchId}/unmatch:
     *   get:
     *     summary: Unmatch a user
     *     description: Removes a match between the authenticated user and another user.
     *     tags:
     *       - Match
     *     parameters:
     *       - in: path
     *         name: matchId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the match.
     *     responses:
     *       200:
     *         description: Match removed successfully.
     *       404:
     *         description: Match not found.
     *       500:
     *         description: Internal server error.
     */
    this.router.get('/:matchId/unmatch', this.matchController.unmatchUser);

    /**
     * @swagger
     * /api/match/{matchId}/chat:
     *   get:
     *     summary: Get chat history with a match
     *     description: Retrieves the chat history between the authenticated user and a match.
     *     tags:
     *       - Match
     *     parameters:
     *       - in: path
     *         name: matchId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the match.
     *     responses:
     *       200:
     *         description: Chat history retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   messageId:
     *                     type: string
     *                     example: "98765"
     *                   senderId:
     *                     type: string
     *                     example: "12345"
     *                   message:
     *                     type: string
     *                     example: "Hey! How are you?"
     *                   timestamp:
     *                     type: string
     *                     format: date-time
     *                     example: "2025-02-28T15:00:00Z"
     *       404:
     *         description: Match or chat history not found.
     *       500:
     *         description: Internal server error.
     */
    this.router.get('/:matchId/chat', this.matchController.getChatHistory);
  }
}
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
     * /api/messages/send:
     *   post:
     *     summary: Send a message
     *     description: Sends a message to a match.
     *     tags: [Messages]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               matchId:
     *                 type: string
     *                 example: "67890"
     *               senderId:
     *                 type: string
     *                 example: "12345"
     *               message:
     *                 type: string
     *                 example: "Hello! How are you?"
     *             required:
     *               - matchId
     *               - senderId
     *               - message
     *     responses:
     *       201:
     *         description: Message sent successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Message sent successfully"
     *       400:
     *         description: Bad request, missing parameters.
     *       500:
     *         description: Internal server error.
     */
    this.router.post('/send', this.messagesController.sendMessage);

    /**
     * @swagger
     * /api/messages/{matchId}:
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
    this.router.get('/:matchId', this.messagesController.getChatMessages);

    /**
     * @swagger
     * /api/messages/{messageId}/delete:
     *   delete:
     *     summary: Delete a message
     *     description: Deletes a message by its ID.
     *     tags: [Messages]
     *     parameters:
     *       - in: path
     *         name: messageId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the message.
     *     responses:
     *       200:
     *         description: Message deleted successfully.
     *       404:
     *         description: Message not found.
     *       500:
     *         description: Internal server error.
     */
    this.router.delete('/:messageId/delete', this.messagesController.deleteMessage);
  }
}
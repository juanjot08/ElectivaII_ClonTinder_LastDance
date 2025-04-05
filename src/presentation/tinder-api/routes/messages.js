import express from 'express';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: 
 */

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
router.post('/send', (req, res) => {
    const { matchId, senderId, message } = req.body;
    if (!matchId || !senderId || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    res.status(201).json({ message: "Message sent successfully" });
});

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
router.get('/:matchId', (req, res) => {
    const { matchId } = req.params;

    const chatHistory = [
        { messageId: "98765", senderId: "12345", message: "Hey! How are you?", timestamp: new Date().toISOString() }
    ];

    res.json(chatHistory);
});

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
router.delete('/:messageId/delete', (req, res) => {
    const { messageId } = req.params;
    res.json({ message: `Message ${messageId} deleted successfully` });
});

export default router;
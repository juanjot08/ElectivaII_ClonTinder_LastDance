import express from "express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Match
 *   description: 
 */

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

router.get("/", (req, res) => {
  res.status(200).json({ matches: [{ userId: "67890", name: "Jane Doe" }] });
});

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
router.get('/:matchId/unmatch', (req, res) => {
    const { matchId } = req.params;
    res.json({ message: `Match ${matchId} removed successfully` });
});

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
router.get('/:matchId/chat', (req, res) => {
    const { matchId } = req.params;

    const chatHistory = [
        { messageId: "98765", senderId: "12345", message: "Hey! How are you?", timestamp: new Date().toISOString() }
    ];

    res.json(chatHistory);
});


export default router;

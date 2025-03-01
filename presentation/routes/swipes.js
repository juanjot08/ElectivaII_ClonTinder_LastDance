import express from "express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Swipes
 *   description: 
 */

/**
 * @swagger
 * /api/swipes:
 *   post:
 *     summary: Swipe on a user
 *     description: Registers a "like" or "dislike" on another user.
 *     tags:
 *       - Swipes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - targetUserId
 *               - action
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "12345"
 *               targetUserId:
 *                 type: string
 *                 example: "67890"
 *               action:
 *                 type: string
 *                 enum: [like, dislike]
 *                 example: like
 *     responses:
 *       200:
 *         description: Swipe recorded successfully.
 *       400:
 *         description: Invalid input.
 */

router.post("/", (req, res) => {
  res.status(200).json({ message: "Swipe recorded successfully" });
});

/**
 * @swagger
 * /api/swipes/history:
 *   get:
 *     summary: Get swipe history
 *     description: Retrieves the list of users the authenticated user has swiped.
 *     tags:
 *       - Swipes
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The authenticated user's ID.
 *     responses:
 *       200:
 *         description: Swipe history retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "67890"
 *                   swipeType:
 *                     type: string
 *                     enum: [like, dislike]
 *                     example: "like"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-28T14:30:00Z"
 *       400:
 *         description: Bad request, missing userId.
 *       500:
 *         description: Internal server error.
 */
router.get('/history', (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "UserId is required" });

    const history = [
        { userId: "67890", swipeType: "like", timestamp: new Date().toISOString() }
    ];

    res.json(history);
});


export default router;

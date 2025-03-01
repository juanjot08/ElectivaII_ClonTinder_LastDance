import express from 'express';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 
 */

/**
 * @swagger
 * /api/users/available:
 *   get:
 *     summary: Get available users for matching
 *     description: Retrieves a list of users that the authenticated user has not swiped yet.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The authenticated user's ID.
 *     responses:
 *       200:
 *         description: List of available users.
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
 *                   name:
 *                     type: string
 *                     example: "Jane Doe"
 *                   age:
 *                     type: integer
 *                     example: 25
 *                   bio:
 *                     type: string
 *                     example: "Love hiking and coffee!"
 *       400:
 *         description: Bad request, missing userId.
 *       500:
 *         description: Internal server error.
 */

router.get("/available", (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "UserId is required" });
    }

    // Simulación de lista de usuarios disponibles (esto debería venir de la BD)
    const availableUsers = [
        { userId: "67890", name: "Jane Doe", age: 25, bio: "Love hiking and coffee!" },
        { userId: "54321", name: "Mike Smith", age: 30, bio: "Adventurer and tech geek" },
    ];

    res.status(200).json(availableUsers);
});

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile information of a specific user.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "12345"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 age:
 *                   type: integer
 *                   example: 28
 *                 bio:
 *                   type: string
 *                   example: "Lover of music and technology"
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    // Simulación de datos
    const user = {
        userId,
        name: "John Doe",
        age: 28,
        bio: "Lover of music and technology"
    };

    res.json(user);
});

export default router;
import { Router } from 'express';
import { userValidation, isValid } from '../validators/users.validator';
import { inject, injectable } from 'tsyringe'
import UserController from '../controllers/users.controller';
import { TYPES } from '../../../application/dependencyInjection/container.types';

@injectable()
export class UserRouter {
  public router: Router;

  constructor(@inject(TYPES.UserController) private userController: UserController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
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
    this.router.get('/available', this.userController.getAvailableUsers
                                                     .bind(this.userController));

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
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 name:
     *                   type: string
     *                   example: "John Doe"
     *                 age:
     *                   type: integer
     *                   example: 28
     *                 gender:
     *                   type: string
     *                   example: "male"
     *       404:
     *         description: User not found.
     *       500:
     *         description: Internal server error.
     */
    this.router.get('/:userId', 
                    userValidation.GetUserRequest, 
                    isValid, 
                    this.userController.getUserProfile
                                       .bind(this.userController));
  }
}
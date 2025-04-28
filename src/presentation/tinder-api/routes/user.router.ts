import { Router } from 'express';
import { userValidation, isValid } from '../validators/users.validator';
import { inject, injectable } from 'tsyringe';
import UserController from '../controllers/users.controller';
import { TYPES } from '../../../application/dependencyInjection/container.types';
import AuthMiddleware from '../middlewares/auth.middleware';

@injectable()
export class UserRouter {
    public router: Router;

    constructor(
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.AuthMiddleware) private authMiddleware: AuthMiddleware
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * @swagger
     * components:
     *   schemas:
     *     UserProfileRequest:
     *       type: object
     *       properties:
     *         name:
     *           type: string
     *           example: "John Doe"
     *         age:
     *           type: integer
     *           example: 28
     *         gender:
     *           type: string
     *           example: "male"
     *         preferences:
     *           type: object
     *           properties:
     *             minAge:
     *               type: integer
     *               example: 25
     *             maxAge:
     *               type: integer
     *               example: 35
     *             interestedInGender:
     *               type: string
     *               example: "female"
     *             maxDistance:
     *               type: integer
     *               example: 50
     *         location:
     *           type: object
     *           properties:
     *             city:
     *               type: string
     *               example: "New York"
     *             country:
     *               type: string
     *               example: "USA"
     *         profilePhoto:
     *           type: string
     *           format: uri
     *           example: "https://example.com/profile.jpg"
     *     UserProfileResponse:
     *       type: object
     *       properties:
     *         name:
     *           type: string
     *           example: "John Doe"
     *         age:
     *           type: integer
     *           example: 28
     *         gender:
     *           type: string
     *           example: "male"
     *         preferences:
     *           type: object
     *           properties:
     *             minAge:
     *               type: integer
     *               example: 25
     *             maxAge:
     *               type: integer
     *               example: 35
     *             interestedInGender:
     *               type: string
     *               example: "female"
     *             maxDistance:
     *               type: integer
     *               example: 50
     *         location:
     *           type: object
     *           properties:
     *             city:
     *               type: string
     *               example: "New York"
     *             country:
     *               type: string
     *               example: "USA"
     *         profilePhoto:
     *           type: string
     *           format: uri
     *           example: "https://example.com/profile.jpg"
     */
    private initializeRoutes(): void {
        /**
         * @swagger
         * /users/me:
         *   get:
         *     summary: Get user profile
         *     description: Retrieves the profile information of the authenticated user.
         *     tags:
         *       - Users
         *     responses:
         *       200:
         *         description: User profile retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/UserProfileResponse'
         *       404:
         *         description: User not found.
         *       500:
         *         description: Internal server error.
         */
        this.router.get(
            '/me',
            this.authMiddleware.authenticateToken,
            userValidation.GetUserRequest,
            isValid,
            this.userController.getUserProfile.bind(this.userController)
        );

        /**
         * @swagger
         * /users/profile:
         *   put:
         *     summary: Create or update a user profile
         *     description: Creates or updates a user profile with the provided details.
         *     tags:
         *       - Users
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UserProfileRequest'
         *     responses:
         *       200:
         *         description: User profile created or updated successfully.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/UserProfileResponse'
         *       400:
         *         description: Bad request. Invalid input data.
         *       500:
         *         description: Internal server error.
         */
        this.router.put(
            '/profile',
            this.authMiddleware.authenticateToken,
            userValidation.UserProfileRequest,
            isValid,
            this.userController.updateUserProfile.bind(this.userController)
        );
    }
}
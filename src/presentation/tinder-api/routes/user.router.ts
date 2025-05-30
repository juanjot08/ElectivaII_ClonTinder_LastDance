import { Router } from 'express';
import { userValidation } from '../validators/users.validator';
import { inject, injectable } from 'tsyringe';
import UserController from '../controllers/users.controller';
import { TYPES } from '../../../application/dependencyInjection/container.types';
import AuthMiddleware from '../middlewares/auth.middleware';
import { isValid } from '../middlewares/validation.middleware';

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
	 *         bio:
	 *           type: string
	 *           example: "A cool biography about me."
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
	 *         bio:
	 *           type: string
	 *           example: "A cool biography about me."
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

		/**
		 * @swagger
		 * /users/profile/photo:
		 *   patch:
		 *     summary: Update user profile photo
		 *     description: Updates the profile photo of the authenticated user.
		 *     tags:
		 *       - Users
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         multipart/form-data:
		 *           schema:
		 *             type: object
		 *             properties:
		 *               profilePhoto:
		 *                 type: string
		 *                 format: binary
		 *                 description: The new profile photo file.
		 *     responses:
		 *       200:
		 *         description: Profile photo updated successfully.
		 *       400:
		 *         description: Bad request. Invalid input data.
		 *       500:
		 *         description: Internal server error.
		 */
		this.router.patch(
			"/profile/photo",
			this.authMiddleware.authenticateToken,
			this.userController.updateProfilePhoto.bind(this.userController)
		);

		/**
		 * @swagger
		 * /users/profile/additional-photos:
		 *   patch:
		 *     summary: Update additional profile photos
		 *     description: Updates the additional profile photos of the authenticated user.
		 *     tags:
		 *       - Users
		 *     security:
		 *       - bearerAuth: []
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         multipart/form-data:
		 *           schema:
		 *             type: object
		 *             properties:
		 *               additionalProfilePhotos:
		 *                 type: array
		 *                 items:
		 *                   type: string
		 *                   format: binary
		 *                 description: Array of additional profile photo files.
		 *     responses:
		 *       200:
		 *         description: Additional profile photos updated successfully.
		 *       400:
		 *         description: Bad request. Invalid input data or no files uploaded.
		 *       401:
		 *         description: Unauthorized. Token not provided or invalid.
		 *       500:
		 *         description: Internal server error.
		 */
		this.router.patch(
			"/profile/additional-photos",
			this.authMiddleware.authenticateToken,
			this.userController.updateAdditionalProfilePhotos.bind(this.userController)
		)

		/**
		 * @swagger
		 * /users/potential-matches:
		 *   get:
		 *     summary: Get potential matches
		 *     description: Retrieves a list of potential matches for the authenticated user.
		 *     tags:
		 *       - Users
		 *     security:
		 *       - bearerAuth: []
		 *     parameters:
		 *       - in: query
		 *         name: lastId
		 *         schema:
		 *           type: string
		 *         required: false
		 *         description: The ID of the last user retrieved, for pagination purposes.
		 *     responses:
		 *       200:
		 *         description: List of potential matches retrieved successfully.
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 matches:
		 *                   type: array
		 *                   items:
		 *                     $ref: '#/components/schemas/UserProfileResponse'
		 *                 lastId:
		 *                   type: number
		 *                   example: 123456
		 *       401:
		 *         description: Unauthorized. Token not provided or invalid.
		 *       404:
		 *         description: No potential matches found.
		 *       500:
		 *         description: Internal server error.
		 */
		this.router.get(
			"/potential-matches",
			this.authMiddleware.authenticateToken,
			this.userController.getPotentialMatches.bind(this.userController)
		);

	}
}
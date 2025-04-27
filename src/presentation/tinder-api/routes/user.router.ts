import { Router } from 'express';
import { userValidation, isValid } from '../validators/users.validator';
import { inject, injectable } from 'tsyringe'
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

  private initializeRoutes(): void {
    // /**
    //  * @swagger
    //  * /api/users/available:
    //  *   get:
    //  *     summary: Get available users for matching
    //  *     description: Retrieves a list of users that the authenticated user has not swiped yet.
    //  *     tags:
    //  *       - Users
    //  *     parameters:
    //  *       - in: query
    //  *         name: userId
    //  *         required: true
    //  *         schema:
    //  *           type: string
    //  *         description: The authenticated user's ID.
    //  *     responses:
    //  *       200:
    //  *         description: List of available users.
    //  *         content:
    //  *           application/json:
    //  *             schema:
    //  *               type: array
    //  *               items:
    //  *                 type: object
    //  *                 properties:
    //  *                   userId:
    //  *                     type: string
    //  *                     example: "67890"
    //  *                   name:
    //  *                     type: string
    //  *                     example: "Jane Doe"
    //  *                   age:
    //  *                     type: integer
    //  *                     example: 25
    //  *                   bio:
    //  *                     type: string
    //  *                     example: "Love hiking and coffee!"
    //  *       400:
    //  *         description: Bad request, missing userId.
    //  *       500:
    //  *         description: Internal server error.
    //  */
    // this.router.get('/available',
    //   this.authMiddleware.authenticateToken,
    //   this.userController.getAvailableUsers
    //     .bind(this.userController));

    /**
     * @swagger
     * /users/me:
     *   get:
     *     summary: Get user profile
     *     description: Retrieves the profile information of a specific user.
     *     tags:
     *       - Users
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
    this.router.get('/me',
      this.authMiddleware.authenticateToken,
      userValidation.GetUserRequest,
      isValid,
      this.userController.getUserProfile
        .bind(this.userController));

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
		*             type: object
		*             properties:
		*               name:
		*                 type: string
		*                 description: The name of the user.
		*                 example: "John Doe"
		*               age:
		*                 type: integer
		*                 description: The age of the user.
		*                 example: 30
		*               gender:
		*                 type: string
		*                 description: The gender of the user.
		*                 example: "male"
		*               preferences:
		*                 type: object
		*                 properties:
		*                   minAge:
		*                     type: integer
		*                     description: Minimum age preference.
		*                     example: 25
		*                   maxAge:
		*                     type: integer
		*                     description: Maximum age preference.
		*                     example: 35
		*                   interestedInGender:
		*                     type: string
		*                     description: Gender preference.
		*                     example: "female"
		*                   maxDistance:
		*                     type: integer
		*                     description: Maximum distance preference in kilometers.
		*                     example: 50
		*               location:
		*                 type: object
		*                 properties:
		*                   city:
		*                     type: string
		*                     description: City of the user.
		*                     example: "New York"
		*                   country:
		*                     type: string
		*                     description: Country of the user.
		*                     example: "USA"
		*               profilePhoto:
		*                 type: string
		*                 format: uri
		*                 description: URL of the user's profile photo.
		*                 example: "https://example.com/profile.jpg"
		*     responses:
		*       200:
		*         description: User profile created or updated successfully.
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 name:
		*                   type: string
		*                   example: "John Doe"
		*                 age:
		*                   type: integer
		*                   example: 30
		*                 gender:
		*                   type: string
		*                   example: "male"
		*                 preferences:
		*                   type: object
		*                   properties:
		*                     minAge:
		*                       type: integer
		*                       example: 25
		*                     maxAge:
		*                       type: integer
		*                       example: 35
		*                     interestedInGender:
		*                       type: string
		*                       example: "female"
		*                     maxDistance:
		*                       type: integer
		*                       example: 50
		*                 location:
		*                   type: object
		*                   properties:
		*                     city:
		*                       type: string
		*                       example: "New York"
		*                     country:
		*                       type: string
		*                       example: "USA"
		*                 profilePhoto:
		*                   type: string
		*                   format: uri
		*                   example: "https://example.com/profile.jpg"
		*       400:
		*         description: Bad request. Invalid input data.
		*       500:
		*         description: Internal server error.
		*/
		this.router.put('/profile',
			this.authMiddleware.authenticateToken,			
			userValidation.UserProfileRequest,
			isValid,
			this.userController.createUserProfile
			.bind(this.userController));

//     /**
// * @swagger
// * /api/users/{userId}:     
// * 
// *   delete:
// *     summary: Delete a user
// *     description: Deletes a user based on the provided request parameters.
// *     tags:
// *       - Users
// *     parameters:
// *       - in: path
// *         name: userId
// *         required: true
// *         schema:
// *           type: string
// *         description: The ID of the user.
// *     responses:
// *       200:
// *         description: User deleted successfully.
// *       400:
// *         description: Bad request.
// *       404:
// *         description: User not found.
// *       500:
// *         description: Internal server error.
// */
//     this.router.delete('/:userId',
//       userValidation.DelteteUserRequest,
//       isValid,
//       this.userController.deleteUser
//         .bind(this.userController));


//     /**
//     * @swagger
//     * /api/users/me:
//     *   patch:
//     *     summary: Update a user
//     *     description: Updates a user with the provided details.
//     *     tags:
//     *       - Users
//     *     parameters:
//     *       - in: path
//     *         name: userId
//     *         required: true
//     *         schema:
//     *           type: string
//     *         description: The ID of the user.
//     *     requestBody:
//     *       required: true
//     *       content:
//     *         application/json:
//     *           schema:
//     *             type: object
//     *             properties:
//     *               age:
//     *                 type: integer
//     *                 description: The updated age of the user.
//     *               gender:
//     *                 type: string
//     *                 description: The updated gender of the user.
//     *               preferences:
//     *                 type: array
//     *                 items:
//     *                   type: string
//     *                 description: Updated preferences.
//     *               location:
//     *                 type: object
//     *                 properties:
//     *                   city:
//     *                     type: string
//     *                   country:
//     *                     type: string
//     *               profilePhoto:
//     *                 type: string
//     *                 format: uri
//     *                 description: Updated profile photo URL.
//     *     responses:
//     *       200:
//     *         description: User updated successfully.
//     *       400:
//     *         description: Bad request.
//     *       404:
//     *         description: User not found.
//     *       500:
//     *         description: Internal server error.
//     */
//     this.router.patch('/me',
//       userValidation.UpdateUserRequest,
//       isValid,
//       this.authMiddleware.authenticateToken,
//       this.userController.updateUser
//         .bind(this.userController));
  }
}
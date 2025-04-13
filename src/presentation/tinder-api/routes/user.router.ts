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

    /**
* @swagger
* /api/users:
*   post:
*     summary: Create a new user
*     description: Creates a new user with the provided details.
*     tags:
*       - Users
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               id:
*                 type: string
*                 description: The unique identifier for the user.
*               name:
*                 type: string
*                 description: The name of the user.
*               age:
*                 type: integer
*                 description: The age of the user.
*               gender:
*                 type: string
*                 description: The gender of the user.
*               preferences:
*                 type: array
*                 items:
*                   type: string
*                 description: User preferences.
*               location:
*                 type: object
*                 properties:
*                   city:
*                     type: string
*                     description: City of the user.
*                   country:
*                     type: string
*                     description: Country of the user.
*               profilePhoto:
*                 type: string
*                 format: uri
*                 description: URL of the user's profile photo.
*     responses:
*       200:
*         description: User created successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: string
*                 name:
*                   type: string
*                 age:
*                   type: integer
*                 gender:
*                   type: string
*                 preferences:
*                   type: array
*                   items:
*                     type: string
*                 location:
*                   type: object
*                   properties:
*                     city:
*                       type: string
*                     country:
*                       type: string
*                 profilePhoto:
*                   type: string
*                   format: uri
*       400:
*         description: Bad request
*       500:
*         description: Internal server error
*/

    this.router.post('/',
      userValidation.PostUserRequest,
      isValid,
      this.userController.createUser
        .bind(this.userController));

    /**
* @swagger
* /api/users/{userId}:     
* 
*   delete:
*     summary: Delete a user
*     description: Deletes a user based on the provided request parameters.
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
*         description: User deleted successfully.
*       400:
*         description: Bad request.
*       404:
*         description: User not found.
*       500:
*         description: Internal server error.
*/
    this.router.delete('/:userId',
      userValidation.DelteteUserRequest,
      isValid,
      this.userController.deleteUser
        .bind(this.userController));

    /**
* @swagger
* /api/users:
*   get:
*     summary: Get all users
*     description: Retrieves a list of all users.
*     tags:
*       - Users
*     responses:
*       200:
*         description: A list of users.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: string
*                   name:
*                     type: string
*                   age:
*                     type: integer
*                   gender:
*                     type: string
*                   preferences:
*                     type: array
*                     items:
*                       type: string
*                   location:
*                     type: object
*                     properties:
*                       city:
*                         type: string
*                       country:
*                         type: string
*                   profilePhoto:
*                     type: string
*                     format: uri
*       500:
*         description: Internal server error.
*/
    this.router.get('/',
      this.userController.getUsers
        .bind(this.userController));

    /**
    * @swagger
    * /api/users/{userId}:
    *   patch:
    *     summary: Update a user
    *     description: Updates a user with the provided details.
    *     tags:
    *       - Users
    *     parameters:
    *       - in: path
    *         name: userId
    *         required: true
    *         schema:
    *           type: string
    *         description: The ID of the user.
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               age:
    *                 type: integer
    *                 description: The updated age of the user.
    *               gender:
    *                 type: string
    *                 description: The updated gender of the user.
    *               preferences:
    *                 type: array
    *                 items:
    *                   type: string
    *                 description: Updated preferences.
    *               location:
    *                 type: object
    *                 properties:
    *                   city:
    *                     type: string
    *                   country:
    *                     type: string
    *               profilePhoto:
    *                 type: string
    *                 format: uri
    *                 description: Updated profile photo URL.
    *     responses:
    *       200:
    *         description: User updated successfully.
    *       400:
    *         description: Bad request.
    *       404:
    *         description: User not found.
    *       500:
    *         description: Internal server error.
    */
    this.router.patch('/:userId',
      userValidation.UpdateUserRequest,
      isValid,
      this.userController.updateUser
        .bind(this.userController));



  }


}
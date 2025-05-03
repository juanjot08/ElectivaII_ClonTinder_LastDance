// src/routes/AuthRoutes.ts
import { Router } from 'express';
import { inject, injectable } from 'tsyringe';
import { TYPES } from '../../../application/dependencyInjection/container.types';
import { AuthController } from '../controllers/auth.controller';
import { authValidation } from '../validators/auth.validator';
import { isValid } from '../middlewares/validation.middleware';

@injectable()
export class AuthRouter {
  public router: Router;

  constructor(@inject(TYPES.AuthController) private _authController: AuthController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {

    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: Create a new user
     *     description: Creates a new user with the provided email and password.
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 description: The user's email address.
     *                 example: user@example.com
     *               password:
     *                 type: string
     *                 description: The user's password.
     *                 example: securePassword123
     *     responses:
     *       201:
     *         description: User created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User created successfully
     *       400:
     *         description: Bad request. Missing or invalid data.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Email and password are required
     *       500:
     *         description: Internal server error.
     */
    this.router.post('/register', authValidation.RegisterRequest, isValid, this._authController.registerUser.bind(this._authController));

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login a user
     *     description: Authenticates a user and returns a token.
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 example: user@example.com
     *               password:
     *                 type: string
     *                 example: securePassword123
     *     responses:
     *       200:
     *         description: Login successful, returns a token.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   example: JWT-TOKEN
     */
    this.router.post('/login', authValidation.LoginRequest, isValid, this._authController.loginUser.bind(this._authController));
  }
}
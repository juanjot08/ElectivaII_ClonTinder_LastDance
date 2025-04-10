// src/routes/AuthRoutes.ts
import { Router, Request, Response } from 'express';

class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {

    /**
     * @swagger
     * /api/auth/register:
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
    this.router.post('/register', this.registerUser);

    /**
     * @swagger
     * /api/auth/login:
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
    this.router.post('/login', this.loginUser);
    
  }

  private registerUser(req: Request, res: Response): void {
    const { email, password } = req.body;

    if (!email || !password) {
      return void res.status(400).json({ error: 'Email and password are required' });
    }

    // Simulación de registro de usuario
    res.status(201).json({ message: 'User registered successfully' });
  }

  private loginUser(req: Request, res: Response): void {
    const { email, password } = req.body;

    if (!email || !password) {
      return void res.status(400).json({ error: 'Email and password are required' });
    }

    // Simulación de autenticación
    res.status(200).json({ token: 'JWT-TOKEN-HERE' });
  }
}

export default new AuthRouter().router;
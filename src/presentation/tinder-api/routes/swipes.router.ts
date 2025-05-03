// src/routes/SwipeRoutes.ts
import { Router } from "express";
import { inject, injectable } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { SwipesController } from "../controllers/swipes.controller";
import { swipeValidation } from "../validators/swipes.validator";
import { isValid } from "../middlewares/validation.middleware";
import AuthMiddleware from "../middlewares/auth.middleware";

@injectable()
export class SwipesRouter {
	public router: Router;

	constructor(
		@inject(TYPES.SwipesController) private swipesController: SwipesController,
		@inject(TYPES.AuthMiddleware) private authMiddleware: AuthMiddleware
	) {
		this.router = Router();
		this.initializeRoutes();
	}

	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     RecordSwipeRequest:
	 *       type: object
	 *       properties:
	 *         targetUserId:
	 *           type: string
	 *           example: "67890"
	 *         swipeType:
	 *           type: string
	 *           enum: [like, dislike]
	 *           example: "like"
	 *       required:
	 *         - userId
	 *         - targetUserId
	 *         - swipeType
	 *     SwipeActionResult:
	 *       type: object
	 *       properties:
	 *         isMatch:
	 *           type: boolean
	 *           example: true
	 *     Swipe:
	 *       type: object
	 *       properties:
	 *         userId:
	 *           type: string
	 *           example: "12345"
	 *         targetUserId:
	 *           type: string
	 *           example: "67890"
	 *         swipeType:
	 *           type: string
	 *           enum: [like, dislike]
	 *           example: "like"
	 *         timestamp:
	 *           type: string
	 *           format: date-time
	 *           example: "2025-02-28T14:30:00Z"
	 */
	private initializeRoutes(): void {

		/**
		 * @swagger
		 * /swipes:
		 *   post:
		 *     summary: Record a swipe action
		 *     description: Registers a "like" or "dislike" action for a user.
		 *     tags:
		 *       - Swipes
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             $ref: '#/components/schemas/RecordSwipeRequest'
		 *     responses:
		 *       200:
		 *         description: Swipe recorded successfully.
		 *         content:
		 *           application/json:
		 *             schema:
		 *               $ref: '#/components/schemas/SwipeActionResult'
		 *       400:
		 *         description: Bad request. Invalid input data.
		 *       500:
		 *         description: Internal server error.
		 */
		this.router.post(
			"/",
			this.authMiddleware.authenticateToken,
			swipeValidation.recordSwipe,
			isValid,
			this.swipesController.recordSwipe.bind(this.swipesController)
		);

		/**
		 * @swagger
		 * /swipes/history:
		 *   get:
		 *     summary: Get swipe history
		 *     description: Retrieves the swipe history of a user.
		 *     tags:
		 *       - Swipes
		 *     responses:
		 *       200:
		 *         description: Swipe history retrieved successfully.
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: array
		 *               items:
		 *                 $ref: '#/components/schemas/Swipe'
		 *       400:
		 *         description: Bad request. Missing or invalid userId.
		 *       500:
		 *         description: Internal server error.
		 */
		this.router.get(
			"/history",
			this.authMiddleware.authenticateToken,
			swipeValidation.getSwipeHistory,
			isValid,
			this.swipesController.getSwipeHistory.bind(this.swipesController)
		);
	}
}
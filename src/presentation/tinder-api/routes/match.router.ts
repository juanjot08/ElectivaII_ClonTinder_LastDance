import { Router } from "express";
import { inject, injectable } from "tsyringe";
import { TYPES } from "../../../application/dependencyInjection/container.types";
import { MatchController } from "../controllers/match.controller";
import { matchValidation } from "../validators/match.validator";
import { isValid } from "../middlewares/validation.middleware";
import AuthMiddleware from "../middlewares/auth.middleware";

@injectable()
export class MatchRouter {
  public router: Router;

  constructor(
    @inject(TYPES.MatchController) private matchController: MatchController,
    @inject(TYPES.AuthMiddleware) private authMiddleware: AuthMiddleware
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     Match:
	 *       type: object
	 *       properties:
	 *         id:
	 *           type: string
	 *           example: "12345"
	 *         userId:
	 *           type: string
	 *           example: "67890"
	 *         targetUserId:
	 *           type: string
	 *           example: "98765"
	 *         createdAt:
	 *           type: string
	 *           format: date-time
	 *           example: "2025-02-28T14:30:00Z"
	 */
  private initializeRoutes(): void {
    /**
     * @swagger
     * /matches/history:
     *   get:
     *     summary: Get match history
     *     description: Retrieves the match history for the authenticated user.
     *     tags:
     *       - Matches
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Match history retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Match'
     *       401:
     *         description: Unauthorized. Token not provided or invalid.
     *       404:
     *         description: Match history not found.
     *       500:
     *         description: Internal server error.
     */
    this.router.get(
      "/history",
      this.authMiddleware.authenticateToken,
			matchValidation.getMatchHistory,
      isValid,
      this.matchController.getMatchHistory.bind(this.matchController)
    );
  }
}
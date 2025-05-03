import { body, param, query } from "express-validator";
import { SwipeAction } from "../../../domain/enumerables/swipeAction.enum";

export const swipeValidation = {
  recordSwipe: [
    param("userId")
      .notEmpty()
      .withMessage("userId is required")
      .isNumeric()
      .withMessage("userId must be a number")
			.escape(),
    body("targetUserId")
      .notEmpty()
      .withMessage("targetUserId is required")
      .isNumeric()
      .withMessage("targetUserId must be a number")
			.escape(),
    body("swipeType")
      .notEmpty()
      .withMessage("swipeType is required")
      .isString()
      .withMessage("swipeType must be a string")
      .isIn(Object.values(SwipeAction))
      .withMessage(`swipeType must be one of: ${Object.values(SwipeAction).join(", ")}`),
  ],
  getSwipeHistory: [
    param("userId")
      .notEmpty()
      .withMessage("userId is required")
      .isNumeric()
      .withMessage("userId must be a number"),
  ],
};
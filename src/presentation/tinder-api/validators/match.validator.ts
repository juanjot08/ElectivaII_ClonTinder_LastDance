import { param } from "express-validator";

export const matchValidation = {
  getMatchHistory: [
    param("userId")
      .notEmpty()
      .withMessage("userId is required")
      .isNumeric()
      .withMessage("userId must be a number"),
  ],
};
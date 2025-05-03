import { validationResult } from "express-validator";
import { BadRequestError } from "../controllers/base/api.hanldlederror";
import { Request, Response } from "express";

export const isValid = (req: Request, res: Response, next: any) => {

	const result = validationResult(req);

	if (!result.isEmpty()) {
		throw new BadRequestError("Validation error", result.array());
		
	} else {

		next();
	}

}
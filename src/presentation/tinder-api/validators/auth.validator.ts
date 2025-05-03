import { body, param } from 'express-validator';

export const authValidation = {
	RegisterRequest: [
		body('email')
			.notEmpty()
			.isEmail()
			.withMessage("The field must be a valid email")
			.escape(),
		body('password')
			.notEmpty()
			.isString()
			.withMessage("The field must be a string")
			.isLength({ min: 8, max: 50 })
			.withMessage("The field must be between 8 and 50 characters")
			.escape(),
	],
	LoginRequest: [
		body('email')
			.notEmpty()
			.isEmail()
			.withMessage("The field must be a valid email")
			.escape(),
		body('password')
			.notEmpty()
			.isString()
			.withMessage("The field must be a string")
			.isLength({ min: 8, max: 50 })
			.withMessage("The field must be between 8 and 50 characters")
			.escape(),
	],
};
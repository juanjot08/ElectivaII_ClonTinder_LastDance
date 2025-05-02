import { body, param } from 'express-validator';

export const userValidation = {
	GetUserRequest: [
		param('userId')
			.notEmpty()
			.isNumeric()
			.withMessage("The field must be a number")
			.escape()
	],
	UserProfileRequest: [
		body('name')
			.optional()
			.isString()
			.withMessage("The field must be a string")
			.isLength({ min: 7, max: 50 })
			.withMessage("The field must be between 7 and 50 characters")
			.escape(),
		body('age')
			.optional()
			.isNumeric()
			.withMessage("The field must be a number")
			.escape(),
		body('gender')
			.optional()
			.isString()
			.withMessage("The field must be a String")
			.escape(),
		body('bio')
			.optional()
			.isString()
			.withMessage("The field must be a String")
			.escape(),
		body('preferences.minAge')
			.optional()
			.isNumeric()
			.withMessage("The field must be a number")
			.escape(),
		body('preferences.maxAge')
			.optional()
			.isNumeric()
			.withMessage("The field must be a number")
			.escape(),
		body('preferences.interestedInGender')
			.optional()
			.isString()
			.withMessage("The field must be a String")
			.escape(),
		body('preferences.maxDistance')
			.optional()
			.isNumeric()
			.withMessage("The field must be a number")
			.escape(),
		body("location.city")
			.optional()
			.isString()
			.withMessage("The field must be a string")
			.isLength({ min: 3, max: 40 })
			.withMessage("The field must be between 3 and 40 characters")
			.escape(),
		body("location.country")
			.optional()
			.isString()
			.withMessage("The field must be a string")
			.isLength({ min: 3, max: 40 })
			.withMessage("The field must be between 3 and 40 characters")
			.escape(),
		body("profilePhoto")
			.optional()
			.isString()
			.withMessage("The field must be a string")
	],
	DelteteUserRequest: [
		param('userId')
			.notEmpty()
			.isNumeric()
			.withMessage("The field must be a number")
			.escape()
	]
}
import { body, param, validationResult } from 'express-validator';
import { Request, Response } from 'express';


export const userValidation = {
    GetUserRequest: [
        param('userId')
        .notEmpty()
        .isNumeric()
        .withMessage("The field must be a number")
        .escape()
    ],
    PostUserRequest: [
        body('id')
        .notEmpty()
        .isNumeric()
        .withMessage("The field must be a number")
        .escape(),
        body('name')
        .notEmpty()
        .isString()
        .withMessage("The field must be a string")
        .isLength({ min: 7, max: 20 })
        .withMessage("The field must be between 7 and 20 characters")
        .escape(),
        body('age')
        .notEmpty()
        .isNumeric()
        .withMessage("The field must be a number")
        .escape(),
        body('gender')
        .notEmpty()
        .isString()
        .withMessage("The field must be a String")
        .isLength({min:8, max:9 })
        .withMessage("The field must be between 8 and 9 characters")
        .escape(),
        body("preferences")
        .notEmpty()
        .isArray({min:0})
        .withMessage("The field must be an array")
        .escape(),
        body("location.city")
        .notEmpty()
        .isString()
        .withMessage("The field must be a string")
        .isLength({ min: 3, max: 20 })
        .withMessage("The field must be between 3 and 20 characters")
        .escape(),
        body("location.country")
        .notEmpty()
        .isString()
        .withMessage("The field must be a string")
        .isLength({ min: 3, max: 40 })
        .withMessage("The field must be between 3 and 20 characters")
        .escape(),
        body("profilePhoto")
        .notEmpty()
        .isString()
        .withMessage("The field must be a string")
    ],
    DelteteUserRequest: [
        param('userId')
        .notEmpty()
        .isNumeric()
        .withMessage("The field must be a number")
        .escape()
    ],
    UpdateUserRequest: [
        param('userId')
        .notEmpty()
        .isNumeric()
        .withMessage("The field must be a number")
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
        .isLength({min:8, max:9 })
        .withMessage("The field must be between 8 and 9 characters")
        .escape(),
        body("preferences")
        .optional()
        .isArray({min:0})
        .withMessage("The field must be an array")
        .escape(),
        body("location.city")
        .optional()
        .isString()
        .withMessage("The field must be a string")
        .isLength({ min: 3, max: 20 })
        .withMessage("The field must be between 3 and 20 characters")
        .escape(),
        body("location.country")
        .optional()
        .isString()
        .withMessage("The field must be a string")
        .isLength({ min: 3, max: 40 })
        .withMessage("The field must be between 3 and 20 characters")
        .escape(),
        body("profilePhoto")
        .optional()
        .isString()
        .withMessage("The field must be a string")
    ],
}


export const isValid = (req: Request, res: Response, next: any) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(422).json({
            errors: result.array()
        });
    } else {

        next();
    }

}
import { param, validationResult } from 'express-validator';

export const userValidation = {
    GetUserRequest: [
        param('userId')
        .notEmpty()
        .isNumeric()
        .withMessage("The field must be a number")
        .escape()
    ]
}


export const isValid = (req, res, next) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(422).json({
            errors: result.array()
        });
    } else {

        next();
    }

}
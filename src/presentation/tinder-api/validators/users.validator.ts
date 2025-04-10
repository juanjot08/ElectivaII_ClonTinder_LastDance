import { param, validationResult } from 'express-validator';
import { Request, Response } from 'express';


export const userValidation = {
    GetUserRequest: [
        param('userId')
        .notEmpty()
        .isNumeric()
        .withMessage("The field must be a number")
        .escape()
    ]
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
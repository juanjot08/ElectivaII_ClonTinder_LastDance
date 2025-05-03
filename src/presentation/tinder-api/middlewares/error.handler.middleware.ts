// src/middlewares/error.handler.ts
import { Request, Response, NextFunction } from 'express';
import { HandledError } from '../controllers/base/api.hanldlederror';
import { ErrorResponse } from '../controllers/base/api.response.interface';
import { StatusCodes, getReasonPhrase } from 'http-status-codes'; // Importa aquí también

export const errorHandler = (
	err: Error | HandledError,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	console.error('Exception:', err.message);

	let statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR; // Usa la constante
	let errorCode = 'INTERNAL_SERVER_ERROR';
	let errorMessage = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR); // Mensaje estándar
	let errorDetails: any | undefined = undefined;

	if (err instanceof HandledError) {
			statusCode = err.statusCode;
			errorCode = err.errorCode;
			errorMessage = err.message;
			errorDetails = err.details;
	} else if (err instanceof Error) {
			errorMessage = err.message;
	}

	const errorResponse: ErrorResponse = {
			success: false,
			error: {
					code: errorCode,
					message: errorMessage,
					details: errorDetails,
			},
	};

	res.status(statusCode).json(errorResponse);
};
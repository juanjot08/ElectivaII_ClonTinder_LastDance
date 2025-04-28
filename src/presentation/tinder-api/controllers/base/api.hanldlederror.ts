import { StatusCodes } from "http-status-codes";

export class HandledError extends Error {
	public statusCode: StatusCodes;
	public errorCode: string;
	public details?: any;

	constructor(
		message: string,
		statusCode: number,
		errorCode: string,
		details?: any
	) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
		this.details = details;

		Object.setPrototypeOf(this, HandledError.prototype);
	}
}

export class BadRequestError extends HandledError {
	constructor(message: string, details?: any) {
		super(message, StatusCodes.BAD_REQUEST, 'BAD_REQUEST', details);
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}
}

export class NotFoundError extends HandledError {
	constructor(message: string) {
		super(message, StatusCodes.NOT_FOUND, 'NOT_FOUND');
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}
}

export class ValidationError extends HandledError {
	constructor(details: any, message: string = 'Validation failure.') {
		super(message, StatusCodes.BAD_REQUEST, 'VALIDATION_ERROR', details);
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}

export class UnauthorizedError extends HandledError {
	constructor(message: string) {
		super(message, StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED');
		Object.setPrototypeOf(this, UnauthorizedError.prototype);
	}
}

export class AlreadyExistsError extends HandledError {
	constructor(message: string) {
		super(message, StatusCodes.CONFLICT, 'ALREADY_EXISTS');
		Object.setPrototypeOf(this, AlreadyExistsError.prototype);
	}
}

export class ForbiddenError extends HandledError {
	constructor(message: string) {
		super(message, StatusCodes.FORBIDDEN, 'FORBIDDEN');
		Object.setPrototypeOf(this, ForbiddenError.prototype);
	}
}
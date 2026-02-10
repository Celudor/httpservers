import { Request, Response, NextFunction } from "express"; 
import { sendErrorMessage } from "../lib/json.js";

export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export function errorHandeler(err: Error, req: Request, res: Response, next: NextFunction) {
    res.header("Content-Type", "application/json");
    if (err instanceof BadRequestError) {
        sendErrorMessage(res, 400, err.message);
    } else if (err instanceof UnauthorizedError) {
        sendErrorMessage(res, 401, err.message);
    } else if (err instanceof ForbiddenError) {
        sendErrorMessage(res, 403, err.message);
    } else if (err instanceof NotFoundError) {
        sendErrorMessage(res, 404, err.message);
    } else {
        console.log(err);
        sendErrorMessage(res, 500, "Something went wrong on our end");
    }
}

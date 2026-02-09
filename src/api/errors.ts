import { Request, Response, NextFunction } from "express"; 

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

function formatErrorMessage(message: string) {
    return JSON.stringify({error: message});
}

export function errorHandeler(err: Error, req: Request, res: Response, next: NextFunction) {
    res.header("Content-Type", "application/json");
    if (err instanceof BadRequestError) {
        res.status(400).send(formatErrorMessage(err.message));
    } else if (err instanceof UnauthorizedError) {
        res.status(401).send(formatErrorMessage(err.message));
    } else if (err instanceof ForbiddenError) {
        res.status(403).send(formatErrorMessage(err.message));
    } else if (err instanceof NotFoundError) {
        res.status(404).send(formatErrorMessage(err.message));
    } else {
        console.log(err);
        res.status(500).send(JSON.stringify({error: "Something went wrong on our end"}));
    }
}

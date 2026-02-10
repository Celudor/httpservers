import { Response } from "express";

export function sendResponse(res: Response, status: number, object: object) {
    res.header("Content-Type", "application/json");
    res.status(status).send(JSON.stringify(object));
}

export function sendErrorMessage(res: Response, status: number, message: string) {
    sendResponse(res, status, {error: message});
}

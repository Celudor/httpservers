import {config} from "../config.js";
import type {Request, Response, NextFunction} from "express";
import { ForbiddenError } from "./errors.js";
import { deleteUsers } from "../lib/db/queries/users.js";
import { sendResponse } from "../lib/json.js";

export async function handlerMetrics(_req: Request, res: Response, next: NextFunction) {
    res.set({"Content-Type": "text/html; charset=utf-8"});
    res.send(`<html><body><h1>Welcome, Chirpy Admin</h1><p>Chirpy has been visited ${config.api.fileserverHits} times!</p></body></html>`);
}

export async function handlerReset(_req:Request, res:Response, next: NextFunction) {
    try {
        if (config.api.platform !== "dev") {
            throw new ForbiddenError("Fobidden");
        }
        config.api.fileserverHits = 0;
        await deleteUsers();
        sendResponse(res, 200, {message: "Hits reset to 0"});
    } catch (err) {
        next(err);
    }
}

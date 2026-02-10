import { createUser } from "../lib/db/queries/users.js";
import type { Request, Response, NextFunction } from "express";
import { BadRequestError } from "./errors.js";
import { sendResponse } from "../lib/json.js";

export async function handlerCreateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const payload: {email:string} = req.body;
        if (!payload.email) {
            throw new BadRequestError("Email propery missing");
        }
        const user = await createUser({email: payload.email});
        sendResponse(res, 201, user); 
    } catch (err) {
        next(err);
    }
}

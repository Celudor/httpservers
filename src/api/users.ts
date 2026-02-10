import { createUser, getUserByEmail } from "../lib/db/queries/users.js";
import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../lib/json.js";
import {checkPasswordHash, hashPassword} from "../lib/auth.js"
import { UnauthorizedError } from "./errors.js";
import { makeJWT } from "../lib/token.js";
import { config } from "../config.js";

export async function handlerCreateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const payload: {email:string; password: string;} = req.body;
        const user = await createUser({
            email: payload.email, 
            hashedPassword: await hashPassword(payload.password)
        });
        sendResponse(res, 201, {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email
        }); 
    } catch (err) {
        next(err);
    }
}


export async function handlerLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const payload: {email: string; password: string; expiresInSeconds?: number;} = req.body;
        const user = await getUserByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedError("incorrect email or password");
        }
        if (!await checkPasswordHash(payload.password, user.hashedPassword)) {
            throw new UnauthorizedError("incorrect email or password");
        }
        const token = makeJWT(
            user.id, 
            payload.expiresInSeconds ? payload.expiresInSeconds : 60 * 60,
            config.api.secret
        );
        sendResponse(res, 200, {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            token: token
        }); 
    } catch (err) {
        next(err);
    }
}

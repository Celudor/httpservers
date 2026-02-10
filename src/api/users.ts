import { createUser, getUserByEmail, setIsChirpyRed, updateUser } from "../lib/db/queries/users.js";
import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../lib/json.js";
import {checkPasswordHash, hashPassword, getBearerToken, getAPIKey} from "../lib/auth.js"
import { createRefreshToken, getRefreshToken, updateRevokeToken } from "../lib/db/queries/refreshTokens.js";
import { NotFoundError, UnauthorizedError } from "./errors.js";
import { makeJWT, makeRefreshToken, validateJWT } from "../lib/token.js";
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
            email: user.email,
            isChirpyRed: user.isChirpyRed,
        }); 
    } catch (err) {
        next(err);
    }
}


export async function handlerLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const payload: {email: string; password: string;} = req.body;
        const user = await getUserByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedError("incorrect email or password");
        }
        if (!await checkPasswordHash(payload.password, user.hashedPassword)) {
            throw new UnauthorizedError("incorrect email or password");
        }
        const token = makeJWT(
            user.id, 
            60 * 60,
            config.api.secret
        );
        const refreshToken = makeRefreshToken();
        createRefreshToken({
            token: refreshToken, 
            userId: user.id, 
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
        });
        sendResponse(res, 200, {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            token: token,
            refreshToken: refreshToken,
            isChirpyRed: user.isChirpyRed,
        }); 
    } catch (err) {
        next(err);
    }
}

export async function handlerRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = getBearerToken(req);
        const refreshToken = await getRefreshToken(token);
        if (!refreshToken) {
            throw new UnauthorizedError("Unauthorized");
        }
        sendResponse(res, 200, {token: makeJWT(refreshToken.userId, 60 * 60, config.api.secret)});
    } catch (err) {
        next(err);
    }

}

export async function handlerRevokeToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = getBearerToken(req);
        await updateRevokeToken(token);
        res.status(204).send();
    } catch(err) {
        next(err);
    }
}

export async function handlerUpdateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const token = getBearerToken(req);
        const userId = validateJWT(token, config.api.secret);
        const payload: {email: string; password: string;} = req.body;
        const hash = await hashPassword(payload.password);
        const user = await updateUser(userId, payload.email, hash);
        sendResponse(res, 200, {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            isChirpyRed: user.isChirpyRed,
        });

    } catch(err) {
        next(err);
    }
}

export async function handlerUserUpgrade(req: Request, res: Response, next: NextFunction) {
    try {
        const apiKey = getAPIKey(req);
        if (apiKey !== config.api.polkaKey) {
            throw new UnauthorizedError("Unauthorized");
        }
        const payload: {event: string; data: {userId: string};} = req.body;
        if (payload.event !== "user.upgraded") {
            res.status(204).send();
            return;
        }
        const user = await setIsChirpyRed(payload.data.userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        res.status(204).send();

    } catch(err) {
        next(err);
    }
}

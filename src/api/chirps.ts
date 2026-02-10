import type { Request, Response, NextFunction } from "express";
import { BadRequestError, ForbiddenError, NotFoundError } from "./errors.js";
import { sendResponse } from "../lib/json.js";
import { createChirp, deleteChirpById, getChirpById, getChirps } from "../lib/db/queries/chirps.js";
import { getBearerToken } from "../lib/auth.js";
import { validateJWT } from "../lib/token.js";
import { config } from "../config.js";


export async function handlerCreateChirp(req: Request, res: Response, next: NextFunction) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.api.secret);
    const payload: {body: string; } = req.body;
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    try {
        if (payload.body.length > 140) {
            throw new BadRequestError("Chirp is too long. Max length is 140");
        }
        const words = payload.body.split(" ");
        const outwords: string[] = []; 
        for (const word of words) {
            if (badWords.includes(word.toLowerCase())) {
               outwords.push("****");
            } else {
                outwords.push(word);
            }
        }
        const chirp = await createChirp({body: outwords.join(" "), userId: userId});
        sendResponse(res, 201, chirp);
    } catch (err) {
        next(err);
    }
}


export async function handlerGetChirps(req: Request, res: Response, next: NextFunction) {
    try {
        const authorId = <string|undefined>req.query.authorId;
        const sort = <"asc"|"desc"|undefined>req.query.sort;
        const chirps = await getChirps(authorId);
        sendResponse(res, 200, sort === "desc" ? chirps.reverse() : chirps);
    } catch (err) {
        next(err);
    }
}

export async function handlerGetChirpById(req: Request, res: Response, next: NextFunction) {
    try {
        const chirpId: string = <string>req.params.chirpId;
        const chirp = await getChirpById(chirpId);
        if (!chirp) {
            throw new NotFoundError(`Chirp ID: ${chirpId} does not exist.`);
        }
        sendResponse(res, 200, chirp);

    } catch (err) {
        next(err);
    }
}

export async function handlerDeleteChirp(req: Request, res: Response, next: NextFunction) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.api.secret);
    const chirpId: string = <string>req.params.chirpId;
    const chirp = await getChirpById(chirpId);
    if (!chirp) {
        throw new NotFoundError("Not found");
    }
    if (chirp.userId !== userId) {
        throw new ForbiddenError("Forbidden");
    }

    await deleteChirpById(chirpId);
    res.status(204).send();

}

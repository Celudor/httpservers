import type { Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError } from "./errors.js";
import { sendResponse } from "../lib/json.js";
import { createChirp, getChirpById, getChirps } from "../lib/db/queries/chirps.js";


export async function handlerCreateChirp(req: Request, res: Response, next: NextFunction) {
    const payload: {body: string; userId: string} = req.body;
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
        const chirp = await createChirp({body: outwords.join(" "), userId: payload.userId});
        sendResponse(res, 201, chirp);
    } catch (err) {
        next(err);
    }
}


export async function handlerGetChirps(_req: Request, res: Response, next: NextFunction) {
    try {
        const chirps = await getChirps();
        sendResponse(res, 200, chirps);
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

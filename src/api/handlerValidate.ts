import type { Request, Response, NextFunction } from "express";
import { BadRequestError } from "./errors.js";
import { sendResponse } from "../lib/json.js";


export async function handlerValidate(req: Request, res: Response, next: NextFunction) {
    const body: {body: string} = req.body;
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    try {
        if (body.body.length > 140) {
            throw new BadRequestError("Chirp is too long. Max length is 140");
        }
        const words = body.body.split(" ");
        const outwords: string[] = []; 
        for (const word of words) {
            if (badWords.includes(word.toLowerCase())) {
               outwords.push("****");
            } else {
                outwords.push(word);
            }
        }
        sendResponse(res, 200, {cleanedBody: outwords.join(" ")});
    } catch (err) {
        next(err);
    }
}

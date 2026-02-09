import type { Request, Response, NextFunction } from "express";
import { BadRequestError } from "./errors.js";


export async function handlerValidate(req: Request, res: Response, next: NextFunction) {
    const body: {body: string} = req.body;
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    res.header("Content-Type", "application/json");
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

        res.status(200).send(JSON.stringify({cleanedBody: outwords.join(" ")}));
    } catch (err) {
        //res.status(400).send(JSON.stringify({error: err instanceof Error? err.message: err}));
        next(err);
    }
}

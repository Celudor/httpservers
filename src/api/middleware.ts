import type {Request, Response, NextFunction} from "express";
import {config} from "../config.js"

export async function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        if (res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}

export async function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.api.fileserverHits = config.api.fileserverHits + 1;
    next();
}

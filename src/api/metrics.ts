import {config} from "../config.js";
import type {Request, Response} from "express";

export async function handlerMetrics(_req: Request, res: Response) {
    res.set({"Content-Type": "text/html; charset=utf-8"});
    res.send(`<html><body><h1>Welcome, Chirpy Admin</h1><p>Chirpy has been visited ${config.fileserverHits} times!</p></body></html>`);
}

export async function handlerReset(_req:Request, res:Response) {
    config.fileserverHits = 0;
    res.send();
}

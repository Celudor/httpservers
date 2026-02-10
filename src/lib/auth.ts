import * as argon2 from "argon2";
import {Request} from "express";
import { UnauthorizedError } from "../api/errors.js";

export function hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
}

export function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
}

export function getBearerToken(req: Request): string {
    const token = req.get('Authorization');
    if (!token) {
        throw new UnauthorizedError("Authorization header is missing");
    } 
    const tokenText = token.trim().split(/\s+/);
    return tokenText[tokenText.length-1];
}

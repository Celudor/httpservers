import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../api/errors.js";

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
    const payload: payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn
    }
    const token = jwt.sign(payload, secret);
    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const payload = jwt.verify(tokenString, secret);
        return <string>payload.sub;
    } catch (err) {
        throw new UnauthorizedError("invalid token");
    }
}

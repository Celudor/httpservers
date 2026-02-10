import {describe, it, expect, beforeAll} from "vitest";
import { makeJWT, validateJWT } from "./token";

describe("JWT token", () => {
    const userId = "user1";
    const secret = "secret";
    let token: string;
    let token2: string;

    beforeAll(() => {
        token = makeJWT(userId, 60, secret);
        token2 = makeJWT(userId, -60, secret);
    });

    it("should be valid token", () => {
        const result = validateJWT(token, secret);
        expect(result).toBe(userId);
    });

    it("should be invalid token", () => {
        expect(() => validateJWT(token2, secret)).toThrowError("invalid token");
    });
});

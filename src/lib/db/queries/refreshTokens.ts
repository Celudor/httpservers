import { sql, eq } from "drizzle-orm";
import {db} from "../index.js";
import { refreshTokens, type NewRefreshToken } from "../schema.js";

export async function createRefreshToken(token: NewRefreshToken) {
    const [result] = await db.insert(refreshTokens).values(token).returning();
    return result;
}

export async function getRefreshToken(token: string) {
    const [result] = await db.select().from(refreshTokens)
    .where(
        sql`${refreshTokens.token} = ${token} and ${refreshTokens.expiresAt} > NOW() and ${refreshTokens.revokedAt} is null`
    );
    return result;
}

export async function updateRevokeToken(token: string) {
    await db.update(refreshTokens).set({
        revokedAt: new Date(),
    }).where(eq(refreshTokens.token, token));
}

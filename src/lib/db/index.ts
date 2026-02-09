import { config } from "src/config.js";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";

const conn = postgres(config.dbURL);
export const db = drizzle(conn, {schema})

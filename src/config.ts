import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/lib/db"
};

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
}

export type APIConfig = {
    fileserverHits: number;
    db: DBConfig;
};

function envOrThrow(key: string) {
    if (! process.env[key]) {
        throw new Error(`Missing ${key}`);
    } else {
        return process.env[key];
    }
}

export let config: APIConfig = {
    fileserverHits: 0,
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    },
};


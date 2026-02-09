process.loadEnvFile();

export type APIConfig = {
    fileserverHits: number;
    dbURL: string;
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
    dbURL: envOrThrow("DB_URL"),
};


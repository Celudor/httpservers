import express from "express";
import { handlerReadiness } from "./api/handlerReadiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics, handlerReset} from "./api/metrics.js";
import { errorHandeler } from "./api/errors.js";
import { handlerCreateUser, handlerLogin } from "./api/users.js";
import { handlerCreateChirp, handlerGetChirps, handlerGetChirpById } from "./api/chirps.js";
import postgres from "postgres";
import {migrate} from "drizzle-orm/postgres-js/migrator";
import {drizzle} from "drizzle-orm/postgres-js";
import { config } from "./config.js";

const migrationClient = postgres(config.db.url, {max: 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

 
const app = express();
const PORT = config.api.port;


app.use("/app", middlewareMetricsInc,  express.static("./src/app"));
app.use(middlewareLogResponses);
app.use(express.json());

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

app.get("/api/healthz", handlerReadiness);
app.post("/api/users", handlerCreateUser);
app.post("/api/login", handlerLogin);
app.post("/api/chirps", handlerCreateChirp);
app.get("/api/chirps", handlerGetChirps);
app.get("/api/chirps/:chirpId", handlerGetChirpById);

app.use(errorHandeler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


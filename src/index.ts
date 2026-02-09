import express from "express";
import { handlerReadiness } from "./api/handlerReadiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics, handlerReset} from "./api/metrics.js";
import { handlerValidate } from "./api/handlerValidate.js";
import { errorHandeler } from "./api/errors.js";

const app = express();
const PORT = 8080;


app.use("/app", middlewareMetricsInc,  express.static("./src/app"));
app.use(middlewareLogResponses);
app.use(express.json());
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidate)
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

app.use(errorHandeler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


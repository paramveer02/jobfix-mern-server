import express from "express";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import notFound from "./middleware/notFound.js";
import { jobRouter } from "./routes/jobRouter.js";

export const app = express();

app.use(express.json());

app.use("/api/v1/jobs", jobRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);


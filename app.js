import express from "express";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import notFound from "./middleware/notFound.js";
import cookieParser from "cookie-parser";

import { jobRouter } from "./routes/jobRouter.js";
import { authRouter } from "./routes/authRouter.js";

export const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

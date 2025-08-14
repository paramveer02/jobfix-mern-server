import express from "express";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import notFound from "./middleware/notFound.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

import { authRouter } from "./routes/authRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { jobRouter } from "./routes/jobRouter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "./public")));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

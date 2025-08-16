import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import notFound from "./middleware/notFound.js";
import { authRouter } from "./routes/authRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { jobRouter } from "./routes/jobRouter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const app = express();

app.set("trust proxy", 1);

// CORS first
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Security headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Body & cookies
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Static
app.use(express.static(path.resolve(__dirname, "./public")));

// Healthcheck
app.get("/health", (_, res) => res.status(200).send("ok"));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);

// 404 & error handler
app.use(notFound);
app.use(errorHandlerMiddleware);

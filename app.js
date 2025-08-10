import express from "express";
import { jobRouter } from "./routes/jobRouter.js";

export const app = express();

app.use(express.json());

app.use("/api/v1/jobs", jobRouter);

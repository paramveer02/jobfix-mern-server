import express from "express";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import notFound from "./middleware/notFound.js";

export const app = express();

app.use(express.json());

app.use(notFound);

app.use(errorHandlerMiddleware);

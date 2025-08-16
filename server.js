import dotenv from "dotenv";
dotenv.config();

import "./config/connectionDB.js";
import { app } from "./app.js";
import morgan from "morgan";
import cloudinary from "cloudinary";

const PORT = process.env.PORT || 5100;

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT} (${process.env.NODE_ENV})`);
});

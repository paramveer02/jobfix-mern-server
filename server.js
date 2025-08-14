import dotenv from "dotenv";
import "./config/connectionDB.js";
import { app } from "./app.js";
import morgan from "morgan";
import cloudinary from "cloudinary";

dotenv.config();

const PORT = process.env.PORT;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

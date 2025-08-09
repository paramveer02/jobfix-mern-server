import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const DB = process.env.DATABASE_URI;
mongoose
  .connect(DB)
  .then(() => console.log("Connection to DB successful"))
  .catch(() => "Connection to DB Unsuccessful");

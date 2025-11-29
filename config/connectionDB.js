import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const DB = process.env.DATABASE_URI;
mongoose
  .connect(DB, {
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("Connection to DB successful"))
  .catch(() => "Connection to DB Unsuccessful");

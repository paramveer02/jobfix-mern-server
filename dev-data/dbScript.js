import dotenv from "dotenv";

import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import Job from "../models/Job.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const json = JSON.parse(fs.readFileSync(`${__dirname}/jobs.json`));

dotenv.config();

const uri = process.env.DATABASE_URI;
try {
  await mongoose.connect(uri);
  console.log("DB connection successful");
} catch (error) {
  console.log(error);
}

const user = await User.findOne({ email: "test@test.com" });
const jobs = json.map((job) => {
  return { ...job, createdBy: user._id };
});

async function importData() {
  try {
    await Job.create(jobs);
    console.log("Import successful");
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

async function deleteData() {
  try {
    await Job.deleteMany();
    console.log("Delete successful");
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

if (process.argv[2] === "--import") {
  importData();
}

if (process.argv[2] === "--delete") {
  deleteData();
}

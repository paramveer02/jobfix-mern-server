import express from "express";
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect } from "../middleware/auth.js";

export const jobRouter = express.Router();

jobRouter.use(protect);

jobRouter.route("/").get(getAllJobs).post(createJob);
jobRouter.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

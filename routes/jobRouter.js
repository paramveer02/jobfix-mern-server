import express from "express";
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect } from "../middleware/auth.js";
import { validateJobInput } from "../middleware/validationMiddleware.js";

export const jobRouter = express.Router();

jobRouter.use(protect);

jobRouter.route("/").get(getAllJobs).post(validateJobInput, createJob);
jobRouter.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

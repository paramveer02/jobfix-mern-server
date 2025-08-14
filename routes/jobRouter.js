import express from "express";
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect } from "../middleware/auth.js";
import {
  validateIdParam,
  validateJobInput,
} from "../middleware/validationMiddleware.js";
import blockDemoWrites from "../middleware/blockDemoWrites.js";

export const jobRouter = express.Router();

jobRouter.use(protect);

jobRouter
  .route("/")
  .get(getAllJobs)
  .post(blockDemoWrites, validateJobInput, createJob);
jobRouter
  .route("/:id")
  .get(validateIdParam, getJob)
  .patch(blockDemoWrites, validateJobInput, updateJob)
  .delete(blockDemoWrites, deleteJob);

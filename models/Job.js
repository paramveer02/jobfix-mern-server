import mongoose from "mongoose";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide your company name"],
    },
    position: {
      type: String,
      required: [true, "Please provide the position"],
    },
    jobStatus: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.PENDING,
    },
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      default: JOB_TYPE.FULL_TIME,
    },
    jobLocation: {
      type: String,
      required: [true, "Please provide the job location"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;

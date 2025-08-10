// controllers/jobController.js
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { Job } from "../models/Job.js";
import { ALLOWED_JOB_UPDATES } from "../utils/constants.js";

export const getAllJobs = async (req, res) => {
  // show only the current user's jobs (admins see all)
  console.log(req.user);
  const filter = req.user?.role === "admin" ? {} : { createdBy: req.user.id };
  const jobs = await Job.find(filter).sort({ createdAt: -1 });

  res.status(StatusCodes.OK).json({
    status: "success",
    results: jobs.length,
    data: { jobs },
  });
};

export const getJob = async (req, res) => {
  const { id } = req.params;

  const query = { _id: id };
  if (req.user?.role !== "admin") query.createdBy = req.user.id;

  const job = await Job.findOne(query).populate({
    path: "createdBy",
    select: "name",
  });
  if (!job) throw new NotFoundError(`Job with id ${id} not found`);

  res.status(StatusCodes.OK).json({ status: "success", data: { job } });
};

export const createJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Company and position are required");
  }

  const payload = {
    ...req.body,
    createdBy: req.user.id,
    jobLocation: req.body.jobLocation ?? req.user.location ?? "my city",
  };

  const job = await Job.create(payload);

  res.status(StatusCodes.CREATED).json({ status: "success", data: { job } });
};

export const updateJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id);

  if (!job) throw new NotFoundError(`Job with id ${id} not found`);

  // ownership (skip for admins)
  if (req.user?.role !== "admin" && job.createdBy.toString() !== req.user.id) {
    throw new UnauthorizedError("You are not allowed to modify this job");
  }

  // apply only allowed fields
  for (const key of ALLOWED_JOB_UPDATES) {
    if (key in req.body) job[key] = req.body[key];
  }

  await job.save(); // runs validators
  res.status(StatusCodes.OK).json({ status: "success", data: { job } });
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id);
  if (!job) throw new NotFoundError(`Job with id ${id} not found`);

  if (req.user?.role !== "admin" && job.createdBy.toString() !== req.user.id) {
    throw new UnauthorizedError("You are not allowed to delete this job");
  }

  await job.deleteOne();
  res.status(StatusCodes.NO_CONTENT).send();
};

import mongoose from "mongoose";
import day from "dayjs";

// controllers/jobController.js
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import Job from "../models/Job.js";
import { ALLOWED_JOB_UPDATES } from "../utils/constants.js";

export const getAllJobs = async (req, res) => {
  // show only the current user's jobs (admins see all)
  const base = req.user?.role === "admin" ? {} : { createdBy: req.user.id };
  const filter = { ...base };

  const { search, jobStatus, jobType } = req.query;

  // 1. Exact filters
  if (jobStatus) filter.jobStatus = jobStatus;
  if (jobType) filter.jobType = jobType;

  // 2. Case-insensitive contains on company OR position
  if (search) {
    // contains match on company OR position (case-insensitive)
    filter.$or = [
      { company: { $regex: search, $options: "i" } },
      { position: { $regex: search, $options: "i" } },
    ];
  }

  // Build query
  let query = Job.find(filter);

  // 3. Sorting
  const sort = req.query.sort || "-createdAt";

  query = query.sort(sort.split(",").join(" "));

  // 4. Field Selection
  if (req.query.fields) {
    const select = req.query.fields.split(",").join(" ");
    query = query.select(select);
  }

  // 5. Pagination
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "20");
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numJobs = await Job.countDocuments();
    if (skip > numJobs) throw new Error("This page does not exist");
  }

  const jobs = await query;

  res.status(StatusCodes.OK).json({
    status: "success",
    results: jobs.length,
    page,
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

  res.status(StatusCodes.OK).json({ status: "success", job });
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

  await job.save();
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

export const showStats = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  let stats = await Job.aggregate([
    { $match: { createdBy: userId } },
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    declined: stats.declined || 0,
    interview: stats.interview || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format("MMM YY");
      return { date, count };
    })
    .reverse();

  return res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

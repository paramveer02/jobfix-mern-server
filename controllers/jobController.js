import { Job } from "../models/Job.js";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();

    res.status(200).json({
      status: "success",
      results: jobs.length,
      data: {
        jobs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        job,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(200).json({
      status: "success",
      job,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "fail", message: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const id = req.params.id;

    const job = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }); // new:true will return a new object

    res.status(200).json({
      status: "success",
      data: {
        job,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const id = req.params.id;

    const job = await Model.findByIdAndDelete(id);
    if (!job) {
      return res
        .status(404)
        .json({ message: "No document found with that id" });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

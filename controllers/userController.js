import { StatusCodes } from "http-status-codes";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { NotFoundError } from "../errors/customErrors.js";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });
  if (!user) throw new NotFoundError("User not found!");
  res.status(StatusCodes.OK).json({ user });
};

export const updateCurrentUser = async (req, res) => {
  const { name, lastName, email, location } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, lastName, email, location },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ user: updatedUser });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();

  res.status(StatusCodes.OK).json({ users, jobs });
};

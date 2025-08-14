import { StatusCodes } from "http-status-codes";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { NotFoundError } from "../errors/customErrors.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });
  if (!user) throw new NotFoundError("User not found!");
  res.status(StatusCodes.OK).json({ user });
};

export const updateCurrentUser = async (req, res) => {
  const newUser = { ...req.body };
  let oldAvatarPublicId;

  if (req.file) {
    // Get the current user to fetch old avatar public id
    const currentUser = await User.findById(req.user.id);
    oldAvatarPublicId = currentUser?.avatarPublicId;

    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, newUser, {
    new: true,
    runValidators: true,
  });

  // Only delete the old avatar if a new one was uploaded and there was an old avatar
  if (req.file && oldAvatarPublicId) {
    await cloudinary.v2.uploader.destroy(oldAvatarPublicId);
  }

  res.status(StatusCodes.OK).json({ user: updatedUser });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();

  res.status(StatusCodes.OK).json({ users, jobs });
};

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

// helper: promisified upload_stream
const uploadBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: "jobfix/avatars" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

export const updateCurrentUser = async (req, res) => {
  const newUser = { ...req.body };
  let oldAvatarPublicId;

  if (req.file) {
    // fetch existing avatar public id (to delete later)
    const currentUser = await User.findById(req.user.id).select(
      "avatarPublicId"
    );
    oldAvatarPublicId = currentUser?.avatarPublicId;

    // upload in-memory buffer to Cloudinary
    const result = await uploadBuffer(req.file.buffer);
    newUser.avatar = result.secure_url;
    newUser.avatarPublicId = result.public_id;
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

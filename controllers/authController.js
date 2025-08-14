import {
  BadRequestError,
  UnauthenticatedError,
} from "../errors/customErrors.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { createSendToken } from "../utils/createSendToken.js";

export const signup = async (req, res) => {
  const { name, lastName, email, password, location, role } = req.body;

  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  const user = await User.create({
    name,
    lastName,
    email,
    role: req.body.role,
    password,
    location,
  });

  createSendToken(user, StatusCodes.CREATED, res);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError("Please provide your email and password");

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    throw new UnauthenticatedError("Please provide correct credentials");

  createSendToken(user, StatusCodes.OK, res);
};

// controllers/authController.js
export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // immediately expire
    sameSite: "lax",
    secure: false, // set true in production (HTTPS)
  });
  res.status(StatusCodes.OK).json({ message: "User logged out!" });
};

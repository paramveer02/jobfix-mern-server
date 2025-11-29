import {
  BadRequestError,
  UnauthenticatedError,
} from "../errors/customErrors.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import createSendToken from "../utils/createSendToken.js";

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

  createSendToken(user, StatusCodes.CREATED, req, res);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError("Please provide your email and password");

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    throw new UnauthenticatedError("Please provide correct credentials");

  createSendToken(user, StatusCodes.OK, req, res);
};

// controllers/authController.js
export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    path: "/",
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction ? true : false,
  });
  res.status(StatusCodes.OK).json({ message: "User logged out!" });
};

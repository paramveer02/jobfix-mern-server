import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { createSendToken } from "../middleware/auth.js";
import { promisify } from "util";

export const signup = async (req, res) => {
  const { name, lastName, email, password, location, role } = req.body;

  if (!email) throw new BadRequestError("Please provide your email");

  const user = await User.create({
    name,
    lastName,
    email,
    password,
    location,
    role,
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

export const protect = async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) throw new UnauthenticatedError("You are not authenticated");

  try {
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.id);
    console.log(user);
    if (!user)
      throw new NotFoundError("User belonging to this token does not exist");

    if (user.changedPasswordAfter(decode.iat))
      throw new UnauthenticatedError(
        "User password was changed recently, please log in again"
      );

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    throw new UnauthenticatedError("Invalid or expired token");
  }
};

export const restrict = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new UnauthorizedError(
        "You do not have the permission to access this route"
      );
    next();
  };
};

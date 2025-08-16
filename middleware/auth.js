import jwt from "jsonwebtoken";
import {
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token = req.cookies?.token;
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) throw new UnauthenticatedError("You are not authenticated");

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.userId);

    if (!user)
      throw new NotFoundError("User belonging to this token does not exist");

    if (user.changedPasswordAfter(decode.iat))
      throw new UnauthenticatedError(
        "Password changed recently. Please log in again"
      );

    req.user = {
      id: user._id,
      role: user.role,
      location: user.location,
      email: user.email,
    };
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

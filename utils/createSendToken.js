import jwt from "jsonwebtoken";

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export default function createSendToken(user, statusCode, req, res) {
  const token = signToken(user._id);

  // Always use cross-site compatible settings in production
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction ? true : false,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 5, // 5 Days
  });

  user.password = undefined;
  return res.status(statusCode).json({ status: "success", user });
}

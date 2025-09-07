import jwt from "jsonwebtoken";

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export default function createSendToken(user, statusCode, req, res) {
  const token = signToken(user._id);

  const origin = req.get("origin") || "";
  const host = req.get("host") || "";
  const isCrossSite = origin && !origin.includes(host);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isCrossSite ? "None" : "Lax",
    secure: isCrossSite ? true : isHttps,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 5, // 5 Days
  });

  user.password = undefined;
  return res.status(statusCode).json({ status: "success", user });
}

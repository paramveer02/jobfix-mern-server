import jwt from "jsonwebtoken";

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const oneDay = 24 * 60 * 60 * 1000;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  user.password = undefined;

  return res.status(statusCode).json({ status: "success", token, user });
};

import { UnauthorizedError } from "../errors/customErrors.js";

const blockDemoWrites = (req, res, next) => {
  const userEmail = req.user?.email;
  const demoEmail = process.env.DEMO_EMAIL?.trim();
  const isDemo =
    userEmail &&
    demoEmail &&
    userEmail.toLowerCase() === demoEmail.toLowerCase();

  if (isDemo) {
    throw new UnauthorizedError("Demo User. Read Only");
  }
  next();
};

export default blockDemoWrites;

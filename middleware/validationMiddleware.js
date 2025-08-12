// middleware/validationMiddleware.js
import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";
import { BadRequestError } from "../errors/customErrors.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";

// helper to surface first error via global handler
const withValidationErrors = (validations) => [
  ...validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError(errors.array()[0].msg);
    }
    next();
  },
];

/* ========== USER ========== */
export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("email already exists");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
  body("location").notEmpty().withMessage("location is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
]);

export const validateLoginInput = withValidationErrors([
  body("email").trim().isEmail().withMessage("Please provide valid email"),
  body("password").notEmpty().withMessage("Please provide password"),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("name").trim().notEmpty().withMessage("Please provide name"),
  body("lastName").trim().notEmpty().withMessage("Please provide last name"),
  body("location").trim().notEmpty().withMessage("Please provide location"),
  // if you allow email update:
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error("email already exists");
      }
    }),
]);

/* ========== JOB ========== */
export const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("company is required"),
  body("position").notEmpty().withMessage("position is required"),
  body("jobLocation").notEmpty().withMessage("job location is required"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid status value"),
  body("jobType").isIn(Object.values(JOB_TYPE)).withMessage("invalid job type"),
]);

/* ========== COMMON: :id param ========== */
export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError("invalid MongoDB id");
    const job = await Job.findById(value);
    if (!job) throw new NotFoundError(`no job with id ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === job.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw UnauthorizedError("not authorized to access this route");
  }),
]);

import express from "express";
import {
  getApplicationStats,
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/userController.js";
import { protect, restrict } from "../middleware/auth.js";
import { validateUpdateUserInput } from "../middleware/validationMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
import blockDemoWrites from "../middleware/blockDemoWrites.js";

export const userRouter = express.Router();

userRouter.use(protect);

userRouter.get("/current-user", getCurrentUser);
userRouter.patch(
  "/update-user",
  blockDemoWrites,
  upload,
  // validateUpdateUserInput,
  updateCurrentUser
);

userRouter.get(
  "/admin/app-stats",
  restrict("admin"),
  getApplicationStats
);

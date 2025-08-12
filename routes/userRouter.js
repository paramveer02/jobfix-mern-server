import express from "express";
import {
  getApplicationStats,
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/userController.js";
import { protect, restrict } from "../middleware/auth.js";
import { validateUpdateUserInput } from "../middleware/validationMiddleware.js";

export const userRouter = express.Router();

userRouter.use(protect);

userRouter.get("/current-user", getCurrentUser);
userRouter.patch("/update-user", validateUpdateUserInput, updateCurrentUser);

userRouter.get("/admin/app-stats", restrict("admin"), getApplicationStats);

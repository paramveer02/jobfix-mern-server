import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../middleware/validationMiddleware.js";

export const authRouter = express.Router();

authRouter.post("/signup", validateRegisterInput, signup);
authRouter.post("/login", validateLoginInput, login);
authRouter.get("/logout", logout);

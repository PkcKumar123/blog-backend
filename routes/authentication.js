import express from "express";
import {
  login,
  logout,
  myProfile,
  register,
} from "../controllers/authControllers.js";
import { isAuthenticated } from "../middlewares/Auth.js";

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticated, myProfile);

export default router;

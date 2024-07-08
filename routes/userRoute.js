import express from "express";
const router = express.Router();

import {
  signUpUser,
  loginUser,
  logoutUser,
  updateUser,
  getUserProfile,
} from "../controller/userController.js";

import { protectRoute } from "../middlewares/protectRoute.js";

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", protectRoute, getUserProfile);
router.post("/profile", protectRoute, updateUser);

export default router;

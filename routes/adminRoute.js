import express from "express";
const router = express.Router();
import User from "../models/userModel.js";

import { protectRoute } from "../middlewares/protectRoute.js";
import { createSong, deleteSong } from "../controller/adminController.js";

const isAdmin = async (req, res, next) => {
  const id = req.user._id;
  const user = await User.findById(id);
  if (user.role === "admin") {
    console.log("You have admin access ");
    next();
  } else {
    res.status(403).json({ error: "You are not an admin" });
    console.log("You are not allowed to access this page ");
    return false;
  }
};

router.post("/songs/create", protectRoute, isAdmin, createSong);
router.delete("/songs/:songId", protectRoute, isAdmin, deleteSong);

export default router;

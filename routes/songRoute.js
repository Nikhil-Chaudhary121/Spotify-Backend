import express from "express";
const router = express.Router();

import {
  getSong,
  likeUnLikeSong,
  addSongInPlaylist,
  getAllSongs,
  getRightFeed,
} from "../controller/songController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

router.get("/allsongs", protectRoute, getAllSongs);
router.get("/rightfeed", protectRoute, getRightFeed);
router.get("/:songId", protectRoute, getSong);
router.post("/like/:songId", protectRoute, likeUnLikeSong);
router.post("/add/:playlistId/:songId", protectRoute, addSongInPlaylist);

export default router;

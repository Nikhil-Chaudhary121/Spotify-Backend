import express from "express";
const router = express.Router();

import {
  createPlaylist,
  getPlaylist,
  deletePlaylist,
  updatePlaylist,
  likeUnlikePlaylist,
  // feedPlaylist,
  getLikedSongs,
  getSuggestions,
  getFeedOne,
  getFeedTwo,
  getLikedPlaylist,
  getOwnPlaylist,
} from "../controller/playlistController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

router.post("/create", protectRoute, createPlaylist);
router.post("/search", protectRoute, getSuggestions);
router.post("/likedsongs", protectRoute, getLikedSongs);
router.put("/update/:playlistId", protectRoute, updatePlaylist);
router.post("/follow/:playlistId", protectRoute, likeUnlikePlaylist);
router.post("/feedone/:userId", protectRoute, getFeedOne);
router.post("/feedtwo/:userId", protectRoute, getFeedTwo);
router.post("/likedplaylist/:userId", protectRoute, getLikedPlaylist);
router.post("/ownplaylist/:userId", protectRoute, getOwnPlaylist);
router.post("/:playlistId", protectRoute, getPlaylist);

router.delete("/:playlistId", protectRoute, deletePlaylist);
// router.post("/feed/:userId", protectRoute, feedPlaylist);

export default router;

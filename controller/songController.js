import User from "../models/userModel.js";
import Song from "../models/songModel.js";
import Playlist from "../models/playlistModel.js";

const getSong = async (req, res) => {
  try {
    const id = req.params.songId;
    // console.log(id);
    const song = await Song.findById(id);
    // const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: "song not found" });
    }

    res.status(200).json({ song });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(`Error in getSong: ${err.message}`);
  }
};
const getAllSongs = async (req, res) => {
  try {
    // const id = req.params.songId;
    // console.log(id);
    const song = await Song.find({});
    // const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: "song not found" });
    }

    res.status(200).json({ song });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(`Error in getSong: ${err.message}`);
  }
};

const likeUnLikeSong = async (req, res) => {
  try {
    const id = req.params.songId;
    let songToModify = await Song.findById(id);
    const user = await User.findById(req.user._id);

    // if (PlaylistToModify.owner.toString() === req.user._id.toString()) {
    //   return res
    //     .status(400)
    //     .json({ error: "You cannot like or unlike your own playlist" });
    // }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!songToModify) {
      return res.status(404).json({ error: "Song not found" });
    }

    const isLiked = user.likedSongs.includes(id);

    if (isLiked) {
      //Unlike the playlist
      //Modify Current User following , modify Playlist
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { likedSongs: id },
      });
      songToModify.totLike = songToModify.totLike - 1;
      songToModify = await songToModify.save();
      console.log(songToModify.totLike);
      res.status(200).json({ message: "Successfully unLiked" });
    } else {
      //Follow the Playlist
      await User.findByIdAndUpdate(req.user._id, {
        $push: { likedSongs: id },
      });
      // await User.findByIdAndUpdate(id, { $push: { totLike: req.user._id } });
      songToModify.totLike = songToModify.totLike + 1;
      songToModify = await songToModify.save();
      console.log(songToModify.totLike);
      res.status(200).json({ message: "Successfully liked" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(`Error in likeUnlikeSong : ${err.message}`);
  }
};

const addSongInPlaylist = async (req, res) => {
  try {
    const { songId, playlistId } = req.params;
    let songToModify = await Song.findById(songId);
    const user = await User.findById(req.user._id);
    let PlaylistToModify = await Playlist.findById(playlistId);

    if (PlaylistToModify.owner.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You are not allowed to add songs in this playlist" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!songToModify) {
      return res.status(404).json({ error: "Song not found" });
    }

    const isAdded = PlaylistToModify.songs.includes(songId);

    if (isAdded) {
      //Unlike the playlist
      //Modify Current User following , modify Playlist
      PlaylistToModify.songs.pop(songId);
      //   await PlaylistToModify.findByIdAndUpdate(playlistId, {
      //     $pull: { songs: songId },
      //   });
      PlaylistToModify.totSongs = PlaylistToModify.totSongs - 1;
      PlaylistToModify = await PlaylistToModify.save();
      //   console.log(PlaylistToModify.totSongs);
      res.status(200).json({ message: "Successfully Removed" });
    } else {
      //Follow the Playlist
      PlaylistToModify.songs.push(songId);
      //   await Playlist.findByIdAndUpdate(playlistId, {
      //     $push: { songs: songId },
      //   });
      // await User.findByIdAndUpdate(id, { $push: { totLike: req.user._id } });
      PlaylistToModify.totSongs = PlaylistToModify.totSongs + 1;
      PlaylistToModify = await PlaylistToModify.save();
      //   console.log(PlaylistToModify.totSongs);
      res.status(200).json({ message: "Successfully Added" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(`Error in likeUnlikeSong : ${err.message}`);
  }
};

const getRightFeed = async (req, res) => {
  try {
    // const id = req.params.songId;
    // console.log(id);
    const songs = await Song.find({}).limit(3);
    // const song = await Song.findById(req.params.id);
    if (!songs) {
      return res.status(404).json({ error: "song not found" });
    }
    res.status(200).json(songs);
  } catch {
    res.status(500).json({ error: err.message });
    console.log(`Error in getSong: ${err.message}`);
  }
};

export {
  getSong,
  likeUnLikeSong,
  addSongInPlaylist,
  getAllSongs,
  getRightFeed,
};

import User from "../models/userModel.js";
import Song from "../models/songModel.js";
import Playlist from "../models/playlistModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPlaylist = async (req, res) => {
  try {
    const { playlistName, category = "Happy", owner } = req.body;
    let { playlistImg = "" } = req.body;
    // const owner = req.user._id;
    if (!playlistName) {
      res.status(400).json({ message: "playlistName are required" });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    // if (user._id.toString() !== req.user._id.toString()) {
    //   res
    //     .status(401)
    //     .json({ message: "You are not authorized to create aPlaylist" });
    if (playlistImg) {
      const uploadesResponse = await cloudinary.uploader.upload(playlistImg);
      playlistImg = uploadesResponse.secure_url;
    }
    // }

    const maxLength = 70;
    if (playlistName.length > maxLength) {
      res.status(400).json({
        message: `Playlist Name should be less than ${maxLength} characters`,
      });
    }
    const newPlaylist = new Playlist({
      playlistName,
      owner,
      playlistImg,
      category,
    });
    await newPlaylist.save();
    // console.log(newPlaylist._id);
    await User.findByIdAndUpdate(req.user._id, {
      $push: { ownPlaylist: newPlaylist._id },
    });

    res
      .status(201)
      .json({ message: "Playlist created successfully", newPlaylist });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(`Error creatingPlaylist : ${err.message}`);
  }
};

const getPlaylist = async (req, res) => {
  try {
    const id = req.params.playlistId;
    // console.log(id);
    let playlist = await Playlist.findById(id)
      .populate("owner")
      .populate("songs");
    // const playlist = await playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "playlist not found" });
    }
    let data = playlist;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(`Error in getPlaylist: ${err.message}`);
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this playlist" });
    }
    await Playlist.findByIdAndDelete(req.params.playlistId);
    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(`Error in deletePlaylist: ${err.message}`);
  }
};

const updatePlaylist = async (req, res) => {
  const { playlistName } = req.body;

  // console.log(profilePic);
  const userId = req.user._id;
  const playlistId = req.params.playlistId;
  try {
    let playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (userId.toString() !== playlist.owner.toString()) {
      //   console.log(userId.toString(), user._id.toString());
      return res
        .status(400)
        .json({ error: "You are not authorized to update this user" });
    }

    // if (profilePic) {
    //   if (user.profilePic) {
    //     await cloudinary.uploader.destroy(
    //       user.profilePic.split("/").pop().split(".")[0]
    //     );
    //   }
    //   const uploadesResponse = await cloudinary.uploader.upload(profilePic);
    //   profilePic = uploadesResponse.secure_url;
    // }

    playlist.playlistName = playlistName;
    playlist = await playlist.save();

    res.status(200).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(`Error in updatePlaylist : ${err.message}`);
  }
};

const likeUnlikePlaylist = async (req, res) => {
  try {
    const id = req.params.playlistId;
    let PlaylistToModify = await Playlist.findById(id);
    const user = await User.findById(req.user._id);

    if (PlaylistToModify.owner.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot like or unlike your own playlist" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!PlaylistToModify) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const isLiked = user.likedPlaylists.includes(id);

    if (isLiked) {
      //Unlike the playlist
      //Modify Current User following , modify Playlist
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { likedPlaylists: id },
      });
      PlaylistToModify.followers = PlaylistToModify.followers - 1;
      PlaylistToModify = await PlaylistToModify.save();
      // console.log(PlaylistToModify.followers);
      res.status(200).json({ message: "Successfully unLiked" });
    } else {
      //Follow the Playlist
      await User.findByIdAndUpdate(req.user._id, {
        $push: { likedPlaylists: id },
      });
      // await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      PlaylistToModify.followers = PlaylistToModify.followers + 1;
      PlaylistToModify = await PlaylistToModify.save();
      // console.log(PlaylistToModify.followers);
      res.status(200).json({ message: "Successfully Liked" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(`Error in likeUnlikePlaylist : ${err.message}`);
  }
};
// const feedPlaylist = async (req, res) => {
//   const { userId } = req.params;
//   // console.log(username);
//   try {
//     const user = await User.findById(userId);
//     if (userId !== req.user._id.toString()) {
//       return res
//         .status(400)
//         .json({ error: "You cannot access other user's feed" });
//     }
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     // const ownedPlaylists = await Playlist.find({ owner: user._id }).sort({
//     //   createdAt: -1,
//     // });
//     const feedOne = await Playlist.find({}).limit(4).populate("songs");
//     const feedTwo = await Playlist.find({})
//       .limit(3)
//       .sort({
//         followers: +1,
//       })
//       .populate("songs");

//     let data = await User.findById(userId)
//       .populate({
//         path: "ownPlaylist",
//         populate: {
//           path: "songs",
//         },
//       })
//       .populate("likedPlaylists")
//       .select("-password")
//       .select("-role")
//       .select("-_id")
//       .select("-email")
//       .select("-name")
//       .select("-username")
//       .select("-likedSongs");

//     const id = req.user._id;
//     const currUser = await User.findById(id).populate("likedSongs");
//     const likedSongs = currUser.likedSongs;
//     // console.log(data.ownPlaylist[0].songs);

//     const feed = {
//       ownPlaylist: data.ownPlaylist,
//       likedPlaylists: data.likedPlaylists,
//       feedOne: feedOne,
//       feedTwo: feedTwo,
//       likedSongs: {
//         playlistName: "Liked Songs",
//         songs: likedSongs,
//         owner: { name: user.name },
//         playlistImg: "/card-img1.jpg",
//       },
//     };
//     res.status(200).json(feed);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//     console.log(`Error in getUserPost : ${error.message}`);
//   }
// };
const getLikedSongs = async (req, res) => {
  try {
    console.log("This is getLikedsongs");
    const userId = req.user._id;
    const user = await User.findById(userId).populate("likedSongs");
    const likedSongs = {
      playlistName: "Liked Songs",
      songs: user.likedSongs,
      owner: { name: user.name },
      playlistImg: "/liked-song-logo.jpg",
    };
    res.status(200).json(likedSongs);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(`Error in getSong: ${error.message}`);
  }
};
const getOwnPlaylist = async (req, res) => {
  try {
    let data = await User.findById(req.user._id)
      .populate({
        path: "ownPlaylist",
        populate: {
          path: "songs",
        },
      })
      .populate("likedPlaylists")
      .select("-password")
      .select("-role")
      .select("-_id")
      .select("-email")
      .select("-name")
      .select("-username")
      .select("-likedSongs");
    res.status(200).json(data.ownPlaylist);
  } catch (error) {
    res.status(500).json({ error: err.message });
    console.log(`Error in getSong: ${err.message}`);
  }
};
const getFeedOne = async (req, res) => {
  try {
    const feedOne = await Playlist.find({}).limit(4).populate("songs");
    res.status(200).json(feedOne);
  } catch (error) {
    res.status(500).json({ error: err.message });
    console.log(`Error in getSong: ${err.message}`);
  }
};

const getFeedTwo = async (req, res) => {
  try {
    const feedTwo = await Playlist.find({})
      .limit(3)
      .sort({
        followers: +1,
      })
      .populate("songs");
    res.status(200).json(feedTwo);
  } catch (error) {
    res.status(500).json({ error: err.message });
    console.log(`Error in getSong: ${err.message}`);
  }
};

const getLikedPlaylist = async (req, res) => {
  try {
    let data = await User.findById(req.user._id).populate("likedPlaylists");
    res.status(200).json(data.likedPlaylists);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(`Error in getSong: ${err.message}`);
  }
};

const getSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    // console.log(username);

    // Find usernames that start with the search query
    const playlistSuggestions = await Playlist.find({
      playlistName: { $regex: `^${query}`, $options: "i" },
    });
    const songSuggestions = await Song.find({
      songName: { $regex: `^${query}`, $options: "i" },
    });

    const suggestions = {
      playlist: [...playlistSuggestions],
      songs: [...songSuggestions],
    };
    res.status(200).json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getSuggestions,
  createPlaylist,
  getPlaylist,
  deletePlaylist,
  updatePlaylist,
  likeUnlikePlaylist,
  getFeedOne,
  getFeedTwo,
  getLikedPlaylist,
  getOwnPlaylist,
  // feedPlaylist
  getLikedSongs,
};

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
  playlistName: {
    type: String,
    required: true,
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
  ],
  followers: {
    type: Number,
    default: 0,
  },
  playlistImg: {
    type: String,
    default: "",
  },
  totSongs: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Happy",
      "Sad",
      "Relaxed",
      "Aggressive",
      "Romantic",
      "Mysterious",
      "Hopeful",
    ],
    default: "Happy",
  },
});

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;

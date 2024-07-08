import mongoose from "mongoose";
const Schema = mongoose.Schema;

const songSchema = new Schema({
  songName: {
    type: String,
    required: true,
    maxLength: 50,
  },
  singerName: {
    type: String,
    required: true,
    maxLength: 50,
  },
  songImg: {
    type: String,
    default: "",
  },
  songUrl: {
    type: String,
    default: "",
  },
  totLike: {
    type: Number,
    default: 0,
  },
  totDur: {
    type: String,
    default: "0:00",
  },
});

const Song = mongoose.model("Song", songSchema);

export default Song;

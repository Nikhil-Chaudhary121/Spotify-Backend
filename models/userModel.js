import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  likedSongs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Song",
    default: [],
  },
  likedPlaylists: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Playlist",
    default: [],
  },
  ownPlaylist: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Playlist",
    default: [],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

// userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;

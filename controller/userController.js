import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generatTokenAndSetCookie from "../utils/helper/generateTokenAndSetCookie.js";

const signUpUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      role: "user",
    });
    await newUser.save();

    if (newUser) {
      const token = generatTokenAndSetCookie(newUser._id, res);
      const data = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        password: null,
        token: token,
        likedSongs: newUser.likedSongs,
        likedPlaylists: newUser.likedPlaylists,
        ownPlaylist: newUser.ownPlaylist,
      };
      res.status(201).json(data);
    } else {
      res.status(400).json({ error: "Invalid User Data" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(`Error in signUpUser: ${err.message}`);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login Route :", username, password);

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const token = generatTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      // token: token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(`Error in loginUser: ${err.message}`);
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "Successfully logged out" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(`Error in loginUser: ${err.message}`);
  }
};

const updateUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  // let { profilePic } = req.body;

  // console.log(profilePic);
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // if (req.params.id !== user._id.toString()) {
    //   return res
    //     .status(400)
    //     .json({ error: "You are not authorized to update this user" });
    // }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
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

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    // user.bio = bio || user.bio;
    // user.profilePic = profilePic || user.profilePic;
    user = await user.save();
    // password should be null in response
    user.password = null;

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(`Error in updateUser : ${err.message}`);
  }
};
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    let user = await User.findById(userId).select("-password");
    // .select("-updatedAt");
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(`Error in getUserProfile: ${err.message}`);
  }
};

export { signUpUser, loginUser, logoutUser, updateUser, getUserProfile };

import Song from "../models/songModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
const createSong = async (req, res) => {
  try {
    const { songName, singerName, totDur } = req.body;
    let { songImg, songUrl } = req.body;
    // console.log(songImg);
    if (!songName || !singerName) {
      res
        .status(400)
        .json({ message: "songName and singerName fields are required" });
    }
    async function uploadAudioToCloudinary(songUrl) {
      try {
        // Upload audio file to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(songUrl, {
          resource_type: "video", // Specify the resource type as "video" for audio files
          folder: "audio", // Optional: Specify a folder in Cloudinary where the audio will be stored
          overwrite: true, // Optional: Overwrite existing file with the same name
          resource_type: "auto", // Automatically detect the resource type
        });

        // Get the secure URL of the uploaded audio file
        const secureUrl = uploadResponse.secure_url;

        // Do something with the secure URL (e.g., save it in a database)
        // console.log("Uploaded audio URL:", secureUrl);

        return secureUrl;
      } catch (error) {
        console.error("Error uploading audio to Cloudinary:", error);
        throw error; // Rethrow the error to handle it in the caller function
      }
    }

    // Example usage
    // const songUrl = "https://example.com/audio.mp3"; // URL of the audio file
    songUrl = await uploadAudioToCloudinary(songUrl);
    console.log("This is new songs url : ", songUrl);
    // .then((secureUrl) => {
    //   songUrl = secureUrl;
    //   // Handle success
    //   console.log("Audio uploaded successfully:", songUrl);
    // })
    // .catch((error) => {
    //   // Handle error
    //   console.error("Error uploading audio:", error);
    // });
    // const user = await User.findById(postedBy);
    // if (songUrl) {
    //   const uploadesSongResponse = await cloudinary.uploader.upload(songUrl);
    //   songUrl = uploadesSongResponse.secure_url;
    // }
    // console.log(songUrl);s
    if (songImg) {
      const uploadesImgResponse = await cloudinary.uploader.upload(songImg);
      songImg = uploadesImgResponse.secure_url;
    }
    // if (!user) {
    //   res.status(404).json({ message: "User not found" });
    // }
    // if (user._id.toString() !== req.user._id.toString()) {
    //   res
    //     .status(401)
    //     .json({ message: "You are not authorized to create a song" });
    // }

    // const maxLength = 50;
    // if (songName.length > maxLength || singerName.length > maxLength) {
    //   res.status(400).json({
    //     message: `SongName and SingerName should be less than ${maxLength} characters`,
    //   });
    // }
    const newSong = new Song({
      songName,
      singerName,
      songImg,
      totDur,
      songUrl,
    });
    await newSong.save();

    res.status(201).json({ message: "Song created successfully", newSong });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(`Error creating song : ${err.message}`);
  }
};

const deleteSong = async (req, res) => {
  try {
    // console.log(req.params.songId);
    const song = await Song.findById(req.params.songId);
    // console.log(song);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    // if (song.postedBy.toString() !== req.user._id.toString()) {
    //   return res
    //     .status(401)
    //     .json({ message: "You are not authorized to delete this song" });
    // }
    await Song.findByIdAndDelete(req.params.songId);
    res.status(200).json({ message: "Song deleted successfully", song });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(`Error in deleteSong: ${err.message}`);
  }
};

export { createSong, deleteSong };

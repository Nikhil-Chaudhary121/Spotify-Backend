import express from "express";
const app = express();
import dotenv from "dotenv";
import connectDb from "./db/connectDb.js";
import cookieParser from "cookie-parser";

import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import playlistRoute from "./routes/playlistRoute.js";
import songRoute from "./routes/songRoute.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

dotenv.config();
connectDb();

const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/playlists", playlistRoute);
app.use("/api/songs", songRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

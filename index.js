import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/database.js";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";

//importing routes
import user from "./routes/authentication.js";
import blog from "./routes/blogRoutes.js";

dotenv.config();

//connection to database
connectDB();

//connection to cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const PORT = process.env.PORT || 6800;

const app = express();

//using middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

//using routes
app.use("/auth", user);
app.use(blog);

app.listen(PORT, () => {
  console.log(`server is working on ${PORT}`);
});

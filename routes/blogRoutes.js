import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlog,
  getBlog,
  updateBlog,
} from "../controllers/blogController.js";
import { isAuthenticated } from "../middlewares/Auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.route("/createblog").post(isAuthenticated, singleUpload, createBlog);

router.route("/blogs").get(isAuthenticated, getAllBlog);

router
  .route("/blog/:id")
  .get(isAuthenticated, getBlog)
  .delete(isAuthenticated, deleteBlog)
  .put(isAuthenticated, updateBlog);

export default router;

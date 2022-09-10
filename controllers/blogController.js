import { User } from "../models/UserModels.js";
import { Blog } from "../models/BlogModels.js";
import cloudinary from "cloudinary";
import getDataUri from "../middlewares/dataUri.js";

export const createBlog = async (req, res) => {
  try {
    const file = req.file;

    const fileUri = getDataUri(file);

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

    const createdBlog = {
      title: req.body.title,
      blog: req.body.blog,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      owner: req.user._id,
    };

    const blog = await Blog.create(createdBlog);

    const user = await User.findById(req.user._id);

    user.blogs.unshift(blog._id);

    await user.save();
    res.status(201).json({
      success: true,
      message: "Blog created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBlog = async (req, res) => {
  try {
    const blog = await Blog.find().populate("owner");

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("owner");

    if (!blog) {
      return res.status(400).json({
        success: false,
        message: "Invailid Id",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog Not Found",
      });
    }

    if (blog.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await cloudinary.v2.uploader.destroy(blog.image.public_id);

    await blog.remove();

    const user = await User.findById(req.user._id);

    const index = user.blogs.indexOf(req.params.id);

    user.blogs.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Blog Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.body.title) {
      blog.title = req.body.title;
    }

    if (req.body.blog) {
      blog.blog = req.body.blog;
    }

    await blog.save();
    res.status(200).json({
      success: true,
      message: "Blog updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");
const fs = require('fs');
require('dotenv').config();

const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

// Configure Multer for file upload
const upload = multer({
  limits: {
    fileSize: 1024 * 1024, // Limit file size to 1MB
    files: 10 // Limit number of files to 10
  },
  dest: 'uploads/' // Destination folder for temporary storage
});

const create = async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    try {
      let imageUrls = [];
  
      // Upload multiple files to Cloudinary if any files are uploaded
      const files = req.files;
      if (files && files.length > 0) {
        if (files.length > 10) {
          return res.status(400).json({
            success: false,
            message: 'Exceeded maximum number of files'
          });
        }
  
        const uploadPromises = files.map(file => {
          return cloudinary.uploader.upload(file.path, { folder: 'posts' });
        });
  
        const uploadResults = await Promise.all(uploadPromises);
  
        // Get the URLs of the uploaded images
        imageUrls = uploadResults.map(result => result.secure_url);
        console.log(uploadPromises, uploadResults, imageUrls);
        // Clean up temporary files
        files.forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
  
      // Create post with or without uploaded images
      let post = await Post.create({
        content: req.body.content,
        media: imageUrls,
        user: req.user._id
      });
  
      // Populate user field
      post = await post.populate('user', 'name');
  
      return res.status(200).json({
        success: true,
        data: {
          post: post
        },
        message: 'Post created'
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
};

const getPostById = async (req, res) => {
    try {
      const postId = req.params.id; // Assuming the ID is passed as a route parameter
  
      const post = await Post.findById(postId)
        .populate("user", "email name id")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "name email",
          },
          populate: {
            path: "likes",
          },
        })
        .populate("likes");
  
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
  
      return res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
};
  
  // Fetch posts by author
const getPostsByAuthor = async (req, res) => {
try {
    const authorId = req.params.authorId; // Assuming the author ID is passed as a route parameter

    const posts = await Post.find({ user: authorId })
    .populate("user", "email name id")
    .populate({
        path: "comments",
        populate: {
        path: "user",
        select: "name email",
        },
        populate: {
        path: "likes",
        },
    })
    .populate("likes");

    return res.json({
    success: true,
    data: posts,
    });
} catch (error) {
    return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message,
    });
}
};

const getAllposts = async function (req, res) {
    // console.log(req.query);
    // const limit = parseInt(req.query.limit);
    // console.log(limit);
    let posts = await Post.find({})
      .sort("-createdAt")
      // .limit(limit)
      .populate("user", "email name id")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name email",
        },
        populate: {
          path: "likes",
        },
      })
      .populate("likes");
    // console.log(posts);
    return res.json(200, {
      message: "list of posts",
      success: true,
      data: {
        // next: {
        //   page: req.query.page,
        //   limit: req.query.limit,
        // },
        posts: posts,
      },
    });
  };

module.exports = {
    getPostById,
    getPostsByAuthor,
    create,
    getAllposts,
    upload
};
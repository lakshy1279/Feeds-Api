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

const destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      post.remove();
      await Comment.deleteMany({ post: req.params.id });
      //doubt in this why it not work with req.param.id
      await Like.deleteMany({ likeable: post, onModel: "Post" });
      //  The $in operator selects the documents where the value of a field equals any value in the specified array.
      await Like.deleteMany({ _id: { $in: post.comments } });
      return res.status(200).json({
        message: "post deleted successfully",
      });
    } else {
      
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updatePostContent = async (req, res) => {
  try {
    const postId = req.params.id; // Assuming the post ID is passed as a route parameter
    const { content } = req.body; // Assuming the updated content is sent in the request body

    // Find the post by ID
    const post = await Post.findById(postId);

    // If the post doesn't exist, return an error response
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Update the content of the post
    post.content = content;
    const updatedPost = await post.save();

    // Return a success response with the updated post
    return res.status(200).json({
      success: true,
      message: 'Post content updated',
      data: {
        post: updatedPost,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
    getPostById,
    getPostsByAuthor,
    create,
    getAllposts,
    destroy,
    updatePostContent,
    upload
};
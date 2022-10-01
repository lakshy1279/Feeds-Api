//Mongoose models allow us to access data from MongoDB in an object-oriented fashion.
const mongoose = require("mongoose");
const path = require("path");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    //The {timestamps: true} option creates a createdAt and updatedAt field on our models that contain timestamps which will get automatically updated when our model changes.
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

const { ObjectID } = require("bson");
const mongoose = require("mongoose");
const path = require("path");
const urlSchema = new mongoose.Schema(
  {
    shortlink : {
      type: String,
      required: true,
      unique: true,
    },
    description : {
      type: String,
      required: true,
    },
    url : {
      type: String,
      required: true,
    },
    tags : {
        type: Array
      },
    id : {
        type: ObjectID,
        require: true
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("url", urlSchema);
module.exports = User;
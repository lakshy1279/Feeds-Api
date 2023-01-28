
const mongoose = require("mongoose");
const path = require("path");
const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref:"User"
    },
    sub_total: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("order", orderSchema);
module.exports = User;
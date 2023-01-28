const Order = require("../models/order");
const User =  require("../models/User");
const jwt = require("jsonwebtoken");

module.exports.create = async function (req, res) {
  console.log(req.body);
  console.log(req.user);
   try {
    let orderData = {
      "name":req.body.name,
      "sub_total":req.body.sub_total,
      "user_id":req.user._id
    }
    let newOrder = await Order.create(orderData);
    return res.json(200, {
      message: "Order created Successfully",
      success: true,
      data: {
          data: newOrder
      },
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "internal server error",
    });
  }
};

module.exports.getOrder = async function (req, res) {
  try{
    console.log(req.params.userid);
    let newOrder = await Order.find({user_id : req.params.userid});
    return res.json(200, {
      message: "Order fetched Successfully",
      success: true,
      data: {
          data: newOrder,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "internal server error",
    });
  }
};



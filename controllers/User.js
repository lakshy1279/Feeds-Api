const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Url = require("../models/order");
const bcrypt = require("bcrypt");

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ mobile: req.body.mobile });
    if (!user) {
      return res.json(422, {
        message: "Invalid mobile no",
      });
    }
    bcrypt.compare(req.body.password, user.password, function(err, result) {
          if (result) {
             return res.json(200, {
              data: {
                token: jwt.sign(user.toJSON(), "biet"),
                user: {
                  name: user.name,
                  mobile: user.mobile,
                  id: user._id,
                },
              },
              success: true,
              message: "sign in Successfully here is your token keep it safe!",
          });

         }
        else
        {
          return res.json(422, {
            message: "Invalid Password",
          });
        }
     });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "internal server error",
    });
  }
};
module.exports.create = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.json(422, {
        message: "password not matched",
      });
    }
    let user = await User.findOne({ mobile: req.body.mobile });
    if (user) {
      return res.json(422, {
        message: "user already exist",
      });
    }
    let userData = {};
    userData.mobile = req.body.mobile;
    userData.name = req.body.name;
    bcrypt.hash(req.body.password, 10, async function(err, hash) {
          if(err)
          {
            return res.json(500, {
              message: "error while login try again",
              data:err
            });
          }
          userData.password = hash;
         let newUser = await User.create(userData);
         return res.json(200, {
          message: "Sign up successful, user created",
          success: true,
          data: {
            token: jwt.sign(newUser.toJSON(), "biet"),
            user: {
              name: newUser.name,
              mobile: newUser.mobile,
              _id: newUser._id,
            },
          },
        });
      });
   
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "internal server error",
    });
  }
};


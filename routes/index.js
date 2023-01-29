const express = require("express");
const passport = require("passport");
const router = express.Router();

const userApi = require("../controllers/User");
const orderApi = require("../controllers/Order");

router.post("/login-user",  userApi.createSession);
router.post("/addUser", userApi.create);
router.post("/add-order", passport.authenticate("jwt", { session: false }), orderApi.create);
router.get("/get-order/:userid", passport.authenticate("jwt", { session: false }), orderApi.getOrder);

console.log("router loaded");

module.exports = router;
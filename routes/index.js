const express = require("express");
const passport = require("passport");
const router = express.Router();

const userApi = require("../controllers/User");

router.post("/login-user",  userApi.createSession);
router.post("/addUser", userApi.create);
router.use("/post", require('./post'));
router.use("/comment", require("./comment"));
router.use("/like", require("./like"));

console.log("router loaded");

module.exports = router;
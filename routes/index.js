const express = require("express");

const router = express.Router();

router.use("/api", require("./api"));
console.log("router loaded");

module.exports = router;
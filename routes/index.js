const express = require("express");
const passport = require("passport");
const router = express.Router();

const userApi = require("../controllers/User");
const shortUrl = require("../controllers/Url");
router.post("/create-session",  userApi.createSession);
router.post("/signup", userApi.create);
router.post("/createShortlink",  passport.authenticate("jwt", { session: false }), shortUrl.createShortLink);
router.get("/search/:key/:value", passport.authenticate("jwt", { session: false }),shortUrl.searchShortlink);
router.get("/allshortlink/:key", passport.authenticate("jwt", { session: false }), userApi.getShortucts);
router.delete("/deleteShortLink/:id", passport.authenticate("jwt", { session: false }), shortUrl.deleteShortlink);

console.log("router loaded");

module.exports = router;
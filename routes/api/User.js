const express = require("express");
const passport = require("passport");
const router = express.Router();

const userApi = require("../../../controllers/api/v1/user_api");
router.post("/create-session", userApi.createSession);
router.post("/signup", userApi.create);
router.post("/update/:id", userApi.update);
router.get(
  "/fetch",
  passport.authenticate("jwt", { session: false }),
  userApi.getUsers
);
module.exports = router;
const express = require("express");
const port = 7000;
const app = express();
const db = require("./config/mongoose");
const cors = require("cors");
const passportJWT = require("./config/passport-jwt");
app.use(cors());
app.use(express.urlencoded({ extended: false }));
//app.use("/", require("./routes"));
app.listen(port, function (err) {
  if (err) {
    console.log(`error in running the server:${err}`);
  }
  console.log(`server is running on the port:${port}`);
});
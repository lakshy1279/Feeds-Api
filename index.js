const express = require("express");
const port = 7000;
const app = express();
const db = require("./config/mongoose");
const cors = require("cors");
const passportJWT = require("./config/passport-jwt");
const path = require("path");
app.use(cors());
app.use(express.json());
const buildPath = path.join(__dirname, "/build");
app.use(express.static(buildPath));
app.get("/", function(req,res)
{
  res.sendFile(path.join(__dirname, "/build/index.html"),
  function(err)
  {
    if(err)
    {
      console.log(err);
      res.status(500).send(err);
    }
  })
})
app.use("/", require("./routes"));
app.listen(port, function (err) {
  if (err) {
    console.log(`error in running the server:${err}`);
  }
  console.log(`server is running on the port:${port}`);
});
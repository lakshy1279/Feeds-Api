const mongoose = require("mongoose");
//mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb+srv://nishant007tech:nishanti69@clusterpossibillion.bj440.mongodb.net/TRW?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "error connecting to mongodb"));

db.once("open", function () {
  console.log("connected to the database");
});

module.exports = db;
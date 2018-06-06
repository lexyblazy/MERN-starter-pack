const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  twitterId: String,
  googleId:String,
  name: String,
  photo:String
});

module.exports = mongoose.model("User", userSchema);

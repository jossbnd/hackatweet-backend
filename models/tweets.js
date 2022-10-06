const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  message: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  date: Date,
  likes: Number,
  token: String,
});

const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;

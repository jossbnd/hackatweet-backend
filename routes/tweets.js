var express = require("express");
var router = express.Router();
const uid2 = require("uid2");
const User = require("../models/users.js");
const Tweet = require("../models/tweets.js");
const { count } = require("../models/tweets.js");

router.get("/", (req, res) => {
  let tweets = [];

  Tweet.find({})

    .populate("user")
    .then((data) => {
      for (let tweet of data) {
        tweets.push({
          message: tweet.message,
          date: tweet.date,
          firstname: tweet.user.firstname,
          username: tweet.user.username,
          likes: tweet.likes,
          token: tweet.token,
        });
      }

      res.json({ result: true, tweets: tweets });
    });
});

router.post("/new/:token", (req, res) => {
  if (req.body.message.length > 280) {
    res.json({
      result: false,
      error:
        "A tweet cannot exceed 280 characters, you have actually " +
        req.body.message.length +
        " caractères",
    });
  } else if (!req.body.message) {
    res.json({ result: false, error: "Message is empty" });
  } else {
    User.findOne({ token: req.params.token }).then((data) => {
      if (data) {
        const newTweet = new Tweet({
          message: req.body.message,
          user: data._id,
          date: Date.now(),
          likes: 0,
          token: uid2(32),
        });

        newTweet.save().then((newDoc) => {});
        res.json({ result: true, message: "Tweet have been add posted" });
      } else {
        res.json({ result: false, error: "User not found" });
      }
    });
  }
});

router.post("/like/:token", (req, res) => {
  Tweet.findOne({ token: req.params.token }).then((data) => {
    if (data) {
      let countTweet = data.likes;

      Tweet.updateOne(
        { token: req.params.token },
        { likes: countTweet + 1 }
      ).then(() => {});

      res.json({ result: true, message: "like added" });
    } else if (!data) {
      res.json({
        result: false,
        message: "cant find your message with this token",
      });
    }
  });
});

router.post("/unlike/:token", (req, res) => {
  Tweet.findOne({ token: req.params.token }).then((data) => {
    if (!data) {
      res.json({
        result: false,
        message: "Cant unlike the tweet, because not find",
      });
    } else if (data.likes === 0) {
      res.json({ result: false, message: "Like is already at 0" });
    } else if (data && data.likes > 0) {
      let countTweet = data.likes;

      Tweet.updateOne(
        { token: req.params.token },
        { likes: countTweet - 1 }
      ).then(() => {});

      res.json({ result: true, message: "One like have been deleted" });
    }
  });
});

router.delete("/delete/:token", (req, res) => {
  Tweet.findOne({ token: req.params.token }).then((data) => {
    if (!data) {
      res.json({
        result: false,
        error: "Can't delete the tweet because not found",
      });
    } else if (data) {
      Tweet.deleteOne({ token: req.params.token }).then(() => {
        res.json({ result: true, message: "Tweet have been deleted" });
      });
    }
  });
});

module.exports = router;

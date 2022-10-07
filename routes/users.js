var express = require("express");
var router = express.Router();
const User = require("../models/users.js");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// Signup
router.post("/signup", (req, res) => {
  // Check if body is empty or not
  if (!req.body.firstname || !req.body.username || !req.body.password) {
    res.json({
      result: false,
      error: "Firstname or Username or Password is empty",
    });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then((data) => {
    if (!data) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        password: hash,
        token: uid2(32),
        likedTweets: [],
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token, username: newDoc.username, firstname: newDoc.firstname });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.post("/signin", (req, res) => {
  // Check if body is empty or not
  if (!req.body.username || !req.body.password) {
    res.json({
      result: false,
      error: "Username or Password is empty",
    });
    return;
  }

  User.findOne({ username: req.body.username }).then((data) => {
    if (!data) {
      res.json({ result: false, error: "User not found" });
    } else {
      if (bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, token: data.token, username: data.username, firstname: data.firstname });
      } else {
        res.json({ result: false, error: "Wrong password" });
      }
    }
  });
});

module.exports = router;

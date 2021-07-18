const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const passport = require("passport");
const User = require("./schema/User");


router.get('/', (req, res, next) => {
  console.log("Hi")
  res.send('server running')
})


router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  let { username, password } = req.body;
  try {
      if (!username || !password) {
          res.status(500);
          res.send({ msg: "Send all fields..." });
      }
      const encryptedPassword = await bcrypt.hash(password, 10);
      const userCheck = await User.find(
          { username: username },
          (error, users) => {
              if (error) throw new Error("Internal error finding user.");
              console.log("Existing user: ", users);
              return users;
          },
      );

      if (userCheck.length)
          return res.send(`The username "${username}" is already in use.`);
      const newUser = new User({
          username: username,
          password: encryptedPassword,
      });
      newUser.save();
      const token = jwt.sign({ userId: newUser.id }, process.env.APP_SECRET, {
          expiresIn: "1d",
      });
      // res.cookie("token", token, {
      //     httpOnly: false,
      //     secure: false,
      //     maxAge: 1000 * 60 * 60 * 24 * 7,
      //     path: '/'
      // })
      res.send({
          token,
          user: newUser,
      });
  } catch (err) {
      console.log("ERROR SIGNING UP", err);
  }
});


router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, { user, token }, failureDetails) => {
      if (err) {
          res.status(500).json({
              message: "Something went wrong authenticating user",
          });
          return;
      }

      if (!user) {
          res.status(401).json(failureDetails);
          return;
      }

      req.login(user, (err) => {
          if (err) {
              res.status(500).json({ message: "Session save went bad." });
              return;
          }

          res.status(200).json({
              token,
              user,
          });
      });
  })(req, res, next);
});




module.exports = router
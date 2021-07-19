const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const passport = require("passport");
const User = require("./schema/User");
const Conversation = require('./schema/Conversation');
const Message = require('./schema/Message');


router.get('/', (req, res, next) => {
  console.log("Hi")
  res.send('server running')
})


router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  let { username, password } = req.body;
  username = username.toLowerCase()
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
      user.username = user.username.toLowerCase()
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


router.post("/usercheck", (req, res, next) => {
    const token = req.body.entity;
    jwt.verify(token, process.env.APP_SECRET, (err, entity) => {
        if (err) {
            return Promise.reject(err);
        }
        return Promise.resolve(entity);
    })
    .then((entity) => {
        res.status(200).json(entity);
    })
    .catch((err) => {
        res.status(200).json(err);
    });
});

router.get('/conversations', async (req, res) => {
  const { username } = req.query
  console.log("LKOL", username)
  const conversations = await Conversation.find({
    'members': username
  })
  return res.status(200).json(conversations)
})

router.post('/conversation', async (req, res) => {
  let { members } = req.body
  if (!members.length) {
    return res.status(200).json({msg: "Pass an array of members"})
  }
  // Sort members array so can easily query all conversations for these members (in diff order can be expensive)
  members = members.sort()
  console.log(members)

  let conversationMatches = await Conversation.find({ "members": { "$size" : members.length, "$all": members }  })
  if (conversationMatches.length) {
    console.log("EXISTS")
    return res.status(300).json({msg: 'Conversation exists', data: conversationMatches[0]})
  }

  const newConversation = new Conversation({ members })
  await newConversation.save()
  return res.status(200).json(newConversation)
})


router.get('/messages', async (req, res) => {
  const { conversationId } = req.query
  const messages = await Message.find({
    conversationId
  }).sort({createdAt: -1})
  return res.status(200).json(messages)
})
router.post('/message', async (req, res) => {
  const message = req.body
  const newMessage = new Message(message)
  await newMessage.save()
  return res.status(200).json(newMessage)
})


module.exports = router
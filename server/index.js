const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const mongoose = require('mongoose')
const passport = require("passport");

const Message = require("./schema/Message");


const PORT = process.env.PORT | 5000
require('dotenv').config()


const app = express()
const server = http.createServer(app)


const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
})



io.on('connection', (socket) => {
  console.log("New connection")

  socket.on("chat message", (msg) => {
    console.log('on server', msg);
    if (!msg.body) return
    const newMessage = new Message(msg)
    newMessage.save()
    io.emit("chat message", msg);
  });


  socket.on('disconnect', () => {
    console.log("Disconnected from socket")
  })
})


mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("🚀 💾 📶 Connected to DB!");
});



const router = require('./router')

server.listen(PORT, () => console.log(`chat server listening on port ${PORT}`))

server.on("error", (error) => {
  if (error.syscall !== "listen") {
      throw error;
  }

  switch (error.code) {
      case "EACCES":
          console.error(
              `Port ${process.env.PORT} requires elevated privileges`,
          );
          process.exit(1);
          break;
      case "EADDRINUSE":
          console.error(`Port ${process.env.PORT} is already in use`);
          process.exit(1);
          break;
      default:
          throw error;
  }
});
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use('/', router)
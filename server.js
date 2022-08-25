const http = require("http");
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const server = http.createServer(app);
const path = require("path");
const fetch = require("node-fetch");

const cookieParser = require("cookie-parser");
const axios = require("axios");

app.use(cookieParser());
const port = 8080;

//Socket
const { Server } = require("socket.io");
const io = new Server(server);

let rooms = [];
let usernames = [];

io.on("connection", (socket) => {
  console.log("Kullanıcı Giriş yaptı");
  socket.on("disconnect", (data) => {
  console.log(`${data.username} Çıkış yaptı`);
  });
  socket.on("join",(room, username)=>{
  rooms[socket.id] = room;
  usernames[socket.id] = username;
    
  socket.leaveAll();
  socket.join(room)
  console.log(`${username} kullanıcısı ${room} url'sine sahip odaya girdi`)
  socket.emit("join")
  })
    socket.on('send', (msg) => {
    io.in(rooms[socket.id]).emit("recieve", `${usernames[socket.id]} : ${msg}`)
    console.log(rooms)
    console.log(usernames)
  });
   socket.on('change video', (videoUrl)=>{
     console.log(`Video Urlsi`)
     io.in(rooms[socket.id]).emit("new video", videoUrl)
   })
    socket.on("recieve", function(message){
    socket.emit("recieve", message);
  })
  socket.on("new video",(data)=>{
   socket.emit("new video", data);
  })
});
//Token generator
function generate_token(length) {
  var a =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_".split("");
  var b = [];
  for (var i = 0; i < length; i++) {
    var j = (Math.random() * (a.length - 1)).toFixed(0);
    b[i] = a[j];
  }
  return b.join("");
}
//Body Parser
app.use(bodyParser.json()).use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//Static
app.use(express.static("public"));
app.set("src", "path/to/views");
//MongoDB
const dbURL = process.env.db;
mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    server.listen(port, () => {
      console.log("mongoDB Bağlantı kuruldu");
    });
  })
  .catch((err) => console.log(err));
//Collections
let Rooms = require("./models/room.js");
let Users = require("./models/users.js");
//Pages
app.get('/',(req,res)=>{
  let token = req.cookies.token;
  if(token != null){
  Rooms.find({ private: "false"})
  .sort()
  .then((roomsResult)=>{
  Users.findOne({ token: token }).then((userResult)=>{
  res.render(`${__dirname}/src/pages/room-list.ejs`,{
    rooms: roomsResult,
    user: userResult,
  })
 })
})
} else {
  res.redirect('/login')
}
})
//Room
app.get('/room/:url',(req,res)=>{
  let token = req.cookies.token;
  let url = req.params.url;
  if(token != null){
  Rooms.findOne({ url: url }).then((roomResult)=>{
    Users.findOne({ token: token }).then((userResult)=>{
    res.render(`${__dirname}/src/pages/room.ejs`,{
      room: roomResult,
      roomId : url,
      user: userResult,
    })
   })
  })
  } else {
    res.redirect('/')
  }
})
//Login Page
app.get('/login',(req,res)=>{
  let token = req.cookies.token;
  if(token != null){
    res.redirect('/');
  } else {
    res.render(`${__dirname}/src/pages/index.ejs`)
  }
})
//Forms
//Login
app.post('/login',(req,res)=>{
  var userId = req.cookies.id;
  if(userId != null){
    res.redirect('/')
  } else {
   var user = new Users({
   username : req.body.username,
   token : generate_token(11),
   })
   user.save()
   .then((UserResult)=>{
   res.cookie('token', UserResult.token)
   res.redirect('/')
   })
  }
})
//Create Room
app.post('/create/room/:token',(req,res)=>{
 let token = req.params.token;
  Users.findOne({ token: token }).then((userResult)=>{
    if(userResult.room != "true"){
      let room = new Rooms({
        roomname: req.body.roomname,
        roomurl: generate_token(8),
        roomAdminToken: token,
        private: req.body.private,
        bannedMembers : []
      })
      room.save().then((roomResult)=>{
        Users.findOneAndUpdate({ token: roomResult.roomAdminToken},{
          room: "true",
          thisRoomUrl: roomResult.roomurl
        }).then((result)=>{
          res.redirect(`/room/${result.thisRoomUrl}`)
        })
      })
    } else {
      res.send("ZATEN ODAN VAR")
    }
  })
})
//Delete Room
app.post('/delete/room/:id',(req,res)=>{
  let url = req.params.id;
  let token = req.cookies.token;
    Rooms.findById(url).then((roomResult)=>{
      if(roomResult.roomAdminToken == token){
        Rooms.findByIdAndDelete(url).then((result)=>{
          Users.findOneAndUpdate({ token: token },{
           room: "false"
          }).then((result)=>{
          res.redirect('/')
          })
        })
      } else {
        res.send("ODA SENİN DEĞİL")
      }
    })
  })

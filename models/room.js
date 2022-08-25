const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RoomSchema = new Schema({
  roomname: {
    type:String,
    require: true,
  },
  roomurl: {
    type: String,
    require: true,
  },
  roomAdminToken : {
    type: String,
    require: true,
  },
  private: {
    type: String,
    require: true,
  },
    users:{
    type: Array,
    require: true,
  }
})

let room = mongoose.model("Room", RoomSchema);
module.exports = room;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: {
    type:String,
    require: true,
  },
  token: {
    type: String,
    reqiure: true,
  },
  room:{
    type: String,
    require: true,
  },
  thisRoomUrl:{
    type: String,
    require: true,
  },
})

let user = mongoose.model("User", UserSchema);
module.exports = user;

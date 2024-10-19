const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true, min: 6, max: 30 },
  email: { type: String, required: true,unique: true},
  password: { type: String, required: true },
  profile_pic: { 
    public_id:{type:String},
    url:{type:String},
   },
});

const User = model("user", UserSchema);
module.exports = User;

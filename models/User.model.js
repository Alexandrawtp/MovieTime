const {
    Schema,
    model
} = require("mongoose");


const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true
  },
   email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  mylist: [String],
  groups: [String],
  isAdmin: Boolean,
  profilePic: {
    type: String,
  },
  bio: String,
});

const UserModel = model("users", userSchema);

module.exports = UserModel;
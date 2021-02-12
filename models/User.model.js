const {
  Schema,
  model
} = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true
  },
  mail: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  mylist: [String],
  groups: [String]
});

const UserModel = model("users", userSchema);

const groupSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  members: [String],
  toprankedfilms: [{
    title: Number //name of film: number of likes by group members
  }],
  news: [{
    name: [{
      likedAFilm: Boolean,
      joinedThegroup: Boolean
    }]
  }]
});

const GroupModel = model('groups', groupSchema);

module.exports = UserModel;
module.exports = GroupModel;
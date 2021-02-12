const {
  Schema,
  model
} = require("mongoose");

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

module.exports = GroupModel;
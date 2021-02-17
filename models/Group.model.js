const {
  Schema,
  model
} = require("mongoose");

const groupSchema = new Schema({
  groupname: {
    type: String,
    unique: true
  },
  owner: {
    type: Schema.Types.ObjectId, 
    ref: 'users',
  },

  isAdmin: Boolean,

  members: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],

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
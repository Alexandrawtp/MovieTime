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

  members: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
});

const UserModel = model("users", userSchema);

module.exports = UserModel;

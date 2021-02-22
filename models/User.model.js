const {
    Schema,
    model
} = require("mongoose");


const userSchema = new Schema({
<<<<<<< HEAD
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
=======
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
>>>>>>> 3c60cf7567d41942af42d762da56761514bcc0fe
});

const UserModel = model("users", userSchema);

module.exports = UserModel;
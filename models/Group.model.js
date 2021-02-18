const {
    Schema,
    model
} = require("mongoose");

const groupSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: String,
    members: [{
        username: String,
        status: String
    }],
    news: [{
        username: String,
        message: String
    }],
});

const GroupModel = model('groups', groupSchema);

module.exports = GroupModel;
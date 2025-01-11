const { Schema, model } = require("mongoose");

//create model for chat
const ChatModel = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = model("Chat", ChatModel);

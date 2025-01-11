const { Schema, model } = require("mongoose");

const MessageModel = new Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  content: { type: String, required: true },
  isAutoReply: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isRead: { type: Boolean, default: false },
});

const Messages = mongoose.model("Message", MessageModel);

export default Messages;

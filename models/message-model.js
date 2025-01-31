const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const messageSchema = new Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    content: { type: String, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Messages = mongoose.model("Message", messageSchema);

module.exports = Messages;

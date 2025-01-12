const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    content: { type: String, required: true },
    sender: { type: String, enum: ["user", "system"], default: "user" },
  },
  { timestamps: true }
);

const Messages = mongoose.model("Message", messageSchema);

export default Messages;

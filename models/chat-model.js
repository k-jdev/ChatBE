const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Связь с пользователем
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of userIds
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);

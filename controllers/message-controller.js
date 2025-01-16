const messageModel = require("../models/message-model");
const chatModel = require("../models/chat-model");

class MessageController {
  async createMessage(req, res) {
    try {
      const { chatId, content, sender } = req.body;
      if (!chatId || !content) {
        return res
          .status(400)
          .json({ message: "Chat ID and content are required" });
      }
      const chat = await chatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      const newMessage = new messageModel({ chatId, content, sender });
      await newMessage.save();
      chat.messages.push(newMessage._id);
      await chat.save();
      res.status(201).json(newMessage);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async getMessagesByChat(req, res) {
    try {
      const messages = await messageModel.find({ chatId: req.params.chatId });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async getLastMessageByChat(req, res) {
    try {
      const lastMessage = await messageModel
        .findOne({ chatId: req.params.chatId })
        .sort({ createdAt: -1 }); // Получаем последнее сообщение

      res.status(200).json(lastMessage);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new MessageController();

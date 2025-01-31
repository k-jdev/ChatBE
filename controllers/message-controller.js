const messageModel = require("../models/message-model");
const chatModel = require("../models/chat-model");
const { mongoose } = require("mongoose");

class MessageController {
  async createMessage(req, res) {
    try {
      console.log("Отримані дані від клієнта:", req.body);

      const { chatId, content, sender, receiver } = req.body;

      if (!chatId || !content || !sender || !receiver) {
        return res
          .status(400)
          .json({ message: "Chat ID, content, sender і receiver обов'язкові" });
      }

      const chat = await chatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Створюємо повідомлення без receiver
      const newMessage = new messageModel({
        chatId: new mongoose.Types.ObjectId(chatId),
        content,
        sender: new mongoose.Types.ObjectId(sender),
      });

      await newMessage.save();

      // Додаємо повідомлення до чату
      chat.messages.push(newMessage._id);
      await chat.save();

      // Надсилаємо повідомлення отримувачу через WebSocket (якщо є)
      const chatClients = clients.get(chatId) || new Map();
      const receiverSocket = chatClients.get(receiver);

      if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
        receiverSocket.send(
          JSON.stringify({
            _id: newMessage._id,
            content: newMessage.content,
            sender: newMessage.sender,
            createdAt: newMessage.createdAt,
          })
        );
      }

      res.status(201).json(newMessage);
    } catch (err) {
      console.error("Помилка в createMessage:", err);
      res.status(500).json({ error: err.message });
    }
  }

  async getMessagesByChat(req, res) {
    try {
      const messages = await messageModel
        .find({ chatId: req.params.chatId })
        .populate("sender", "email firstName lastName");
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

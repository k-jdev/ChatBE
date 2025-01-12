const chatModel = require("../models/chat-model");

class ChatController {
  async createChat(req, res) {
    try {
      const { firstName, lastName } = req.body;
      if (!firstName || !lastName) {
        return res
          .status(400)
          .json({ message: "First and last names are required" });
      }
      const newChat = new chatModel({ firstName, lastName });
      await newChat.save();
      res.status(201).json(newChat);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async getAllChats(req, res) {
    try {
      const chats = await chatModel.find();
      res.status(200).json(chats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async updateChat(req, res) {
    try {
      const { firstName, lastName } = req.body;
      if (!firstName || !lastName) {
        return res
          .status(400)
          .json({ message: "First and last names are required" });
      }
      const chat = await chatModel.findById(req.params.id);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      chat.firstName = firstName;
      chat.lastName = lastName;
      await chat.save();
      res.status(200).json(chat);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async deleteChat(req, res) {
    try {
      const chat = await chatModel.findById(req.params.id);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      await chat.delete();
      res.status(200).json({ message: "Chat deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async confirmDeleteChat(req, res) {
    try {
      const chat = await chatModel.findById(req.params.id);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      await chat.delete();
      res
        .status(200)
        .json({ message: "Are you sure you want to delete this chat?" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ChatController();

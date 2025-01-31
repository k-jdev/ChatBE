const chatModel = require("../models/chat-model");
const userModel = require("../models/user-model");

class ChatController {
  async createChat(req, res) {
    try {
      const { firstName, lastName, userId } = req.body;

      if (!firstName || !lastName || !userId) {
        return res
          .status(400)
          .json({ message: "First name, last name, and userId are required" });
      }

      const userExists = await userModel.findById(userId);
      if (!userExists) {
        return res
          .status(400)
          .json({ message: "User with this ID does not exist" });
      }

      const newChat = new chatModel({
        firstName,
        lastName,
        userId,
        users: [userId],
      });
      await newChat.save();

      res.status(201).json(newChat);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async addUserToChat(req, res) {
    try {
      const { chatId, userId } = req.body;

      if (!chatId || !userId) {
        return res
          .status(400)
          .json({ message: "Chat ID and user ID are required" });
      }

      const chat = await chatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      if (!chat.users.includes(userId)) {
        chat.users.push(userId);
        await chat.save();
      }

      res.status(200).json(chat);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAllChats(req, res) {
    const { search } = req.query;
    try {
      let chats = [];

      if (search) {
        chats = await chatModel
          .find({
            $or: [
              { firstName: { $regex: search, $options: "i" } },
              { lastName: { $regex: search, $options: "i" } },
            ],
          })
          .populate("userId", "email name");
      } else {
        chats = await chatModel.find().populate("userId", "email name");
      }

      if (!Array.isArray(chats)) {
        chats = [chats];
      }

      return res.status(200).json(chats);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getChatById(req, res) {
    try {
      const { id } = req.params;

      const chat = await chatModel
        .findById(id)
        .populate("userId", "email name");

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      res.status(200).json(chat);
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
      return res
        .status(200)
        .json({ message: "Are you sure you want to delete this chat?" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ChatController();

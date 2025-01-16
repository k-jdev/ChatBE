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

      // Проверяем существование пользователя
      const userExists = await userModel.findById(userId);
      if (!userExists) {
        return res
          .status(400)
          .json({ message: "User with this ID does not exist" });
      }

      const newChat = new chatModel({ firstName, lastName, userId });
      await newChat.save();

      res.status(201).json(newChat);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async getAllChats(req, res) {
    const { search } = req.query; // Получаем поисковый запрос из параметра query
    try {
      let chats = [];

      if (search) {
        // Поиск с фильтром по имени и фамилии (регистронезависимый)
        chats = await chatModel
          .find({
            $or: [
              { firstName: { $regex: search, $options: "i" } }, // Поиск по имени
              { lastName: { $regex: search, $options: "i" } }, // Поиск по фамилии
            ],
          })
          .populate("userId", "email name");
      } else {
        // Получение всех чатов
        chats = await chatModel.find().populate("userId", "email name");
      }

      // Если результат не массив (на всякий случай), превращаем его в массив
      if (!Array.isArray(chats)) {
        chats = [chats];
      }

      console.log("Chats found:", chats); // Лог для проверки результата
      return res.status(200).json(chats); // Отправляем массив чатов на клиент
    } catch (err) {
      return res.status(500).json({ error: err.message });
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

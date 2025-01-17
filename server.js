// server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const parser = require("body-parser");
const router = require("./router/index");
const errorMiddleware = require("./middlewares/error-middleware");
const WebSocket = require("ws");

const PORT = process.env.PORT || 5200;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(parser.json());

app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () => {
      console.log(`Server started on PORT = ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

// WebSocket сервер
const wss = new WebSocket.Server({ port: 3002 });

let clients = new Map(); // Храним всех подключённых клиентов

wss.on("connection", (ws) => {
  console.log("WebSocket клиент подключен");

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "join") {
      // Добавляем клиента в комнату (chatId)
      if (!clients.has(data.chatId)) {
        clients.set(data.chatId, new Set());
      }
      clients.get(data.chatId).add(ws);
      console.log(`Клиент присоединился к чату ${data.chatId}`);
    } else if (data.type === "message") {
      // Рассылаем сообщение клиентам в той же комнате (chatId)
      const chatClients = clients.get(data.chatId) || new Set();
      chatClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });

  ws.on("close", () => {
    // Убираем клиента из всех чатов
    for (const [chatId, chatClients] of clients.entries()) {
      chatClients.delete(ws);
      if (chatClients.size === 0) {
        clients.delete(chatId);
      }
    }
    console.log("WebSocket клиент отключён");
  });

  ws.on("error", (error) => {
    console.error("WebSocket ошибка:", error);
  });
});

console.log("WebSocket server is running on ws://localhost:3002");

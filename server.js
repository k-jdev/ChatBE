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

let clients = new Set(); // Храним всех подключённых клиентов

wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.add(ws);

  ws.on("message", (message) => {
    console.log("Received:", message);

    // Рассылаем сообщение всем клиентам
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

console.log("WebSocket server is running on ws://localhost:3002");

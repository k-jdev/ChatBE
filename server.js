//import librares
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
const wss = new WebSocket.Server({ port: 3001 });

const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);

  ws.on("close", () => {
    clients.delete(ws);
  });
});

// import modules like cors
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

app.post("/chat", (req, res) => {
  const { player, message } = req.body;

  // Рассылка сообщения всем подключенным клиентам
  const payload = JSON.stringify({ player, message });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  res.status(200).send("Message broadcasted");
});
//функція старту сервера
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

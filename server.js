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
const axios = require("axios");

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
const wss = new WebSocket.Server({ port: 3004 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    console.log("Received:", message);
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === "enableAutoMessages") {
      // Отримати цитату і надіслати назад
      try {
        const quote = await fetchQuoteWithRetry();
        const autoMessage = {
          type: "autoMessage",
          content: quote,
          sender: "system",
          time: new Date().toISOString(),
        };
        ws.send(JSON.stringify(autoMessage));
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

console.log("WebSocket server is running on ws://localhost:3002");

// Нова функція для отримання цитати з використанням RapidAPI
// const fetchQuoteWithRetry = async (retries = 3, delay = 1000) => {
//   const options = {
//     method: "GET",
//     url: "https://favqs.com/api/qotd",
//   };

//   for (let attempt = 0; attempt < retries; attempt++) {
//     try {
//       const response = await axios.request(options);
//       return response.data.quote.body; // Повертає текст цитати
//     } catch (error) {
//       if (attempt < retries - 1) {
//         console.log(`Retrying... (${attempt + 1}/${retries})`);
//         await new Promise((resolve) => setTimeout(resolve, delay));
//       } else {
//         throw new Error("Failed to fetch quote after retries.");
//       }
//     }
//   }
// };

const Router = require("express").Router;
const router = new Router();
const { body } = require("express-validator");
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middlewares/authMiddleware");
const chatController = require("../controllers/chat-controller");
const messageController = require("../controllers/message-controller");

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  body("firstName").isLength({ min: 3, max: 32 }),
  body("lastName").isLength({ min: 3, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/chats", chatController.createChat);
router.post("/messages", messageController.createMessage);
router.post("/chats/addUser", chatController.addUserToChat);

router.get("/messages/:chatId", messageController.getMessagesByChat);
router.get("/chats/:id", chatController.getChatById);
router.get("/messages/:chatId/last", messageController.getLastMessageByChat);

// router.get("/activate:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", userController.getUsers);
router.get("/chats", chatController.getAllChats);
router.put("/chats/:id", chatController.updateChat);
router.delete("/chats/:id", chatController.deleteChat);
router.delete("/chats/:id/confirm", chatController.confirmDeleteChat);

module.exports = router;

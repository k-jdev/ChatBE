const Router = require("express").Router;
const router = new Router();
const { body } = require("express-validator");
const userController = require("../controllers/user-controller");

router.post("/register", userController.registerUser);

module.exports = router;
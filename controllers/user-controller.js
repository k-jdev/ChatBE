const userModel = require("../models/user-model.js");

class UserController {
     async registerUser (req, res) {
        const {name, email, password} = req.body;
        res.send({email, name});
    }
}

module.exports = new UserController();
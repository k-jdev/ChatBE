const { Schema, model } = require("mongoose");

//create model for user
const UserModel = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  isActivated: { type: Boolean, default: false },
  isRegistered: { type: Boolean, default: false },
  activationLink: { type: String },
});

module.exports = model("User", UserModel);

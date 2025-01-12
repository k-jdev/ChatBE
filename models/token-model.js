const { Schema, model } = require("mongoose");

const TokenSchema = new Schema({
  //ref this part of model to user
  user: { type: Schema.Types.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
});

module.exports = model("Token", TokenSchema);

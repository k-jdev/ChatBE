const { Schema, model } = require("mongoose");

//create model for token
const TokenModel = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
});

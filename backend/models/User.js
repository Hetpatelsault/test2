const mongoose = require("mongoose");/*This imports Mongoose, a library that helps Node.js interact with MongoDB easily*/

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("User", UserSchema);

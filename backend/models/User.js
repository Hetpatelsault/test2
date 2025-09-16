const mongoose = require("mongoose");/*This imports Mongoose, a library that helps Node.js interact with MongoDB easily*/
/*A Schema is like a blueprint for how data is stored in MongoDB*/
/*must be a string, required, and unique (no duplicates allowed).
must be a string and required*/
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
/*A Model is like a tool to create, read, update, delete users in the database */
module.exports = mongoose.model("User", UserSchema);
/*overall creates a User model to interact with the database */
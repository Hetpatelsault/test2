const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 }
});

module.exports = mongoose.model("Reaction", ReactionSchema);

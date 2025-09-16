const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/User");
const Reaction = require("./models/Reaction");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/authDemo", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Register API
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false, message: "All fields required" });

  const hashedPass = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ username, password: hashedPass });
    await newUser.save();
    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.json({ success: false, message: "User already exists" });
  }
});

// Login API
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.json({ success: false, message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ success: false, message: "Invalid password" });

  res.json({ success: true, message: "Login successful" });
});

// Reactions
app.get("/reactions/:username", async (req, res) => {
  const { username } = req.params;
  let reaction = await Reaction.findOne({ username });
  if (!reaction) {
    reaction = new Reaction({ username });
    await reaction.save();
  }
  res.json({ likes: reaction.likes, dislikes: reaction.dislikes });
});

app.post("/like", async (req, res) => {
  const { username } = req.body;
  const reaction = await Reaction.findOneAndUpdate(
    { username },
    { $inc: { likes: 1 } },
    { new: true, upsert: true }
  );
  res.json({ likes: reaction.likes, dislikes: reaction.dislikes });
});

app.post("/dislike", async (req, res) => {
  const { username } = req.body;
  const reaction = await Reaction.findOneAndUpdate(
    { username },
    { $inc: { dislikes: 1 } },
    { new: true, upsert: true }
  );
  res.json({ likes: reaction.likes, dislikes: reaction.dislikes });
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));

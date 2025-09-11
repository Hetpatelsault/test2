const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/User");
/*app is the main server object.

Lets the server understand JSON data sent by the client */
const app = express();
app.use(bodyParser.json());
app.use(cors());

/*Connects to a local MongoDB database named authDemo.
useNewUrlParser and useUnifiedTopology are options to avoid warnings */
mongoose.connect("mongodb://127.0.0.1:27017/authDemo", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//  Register API
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

//  Login API
/*Finds the user in the database by username */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.json({ success: false, message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ success: false, message: "Invalid password" });

  res.json({ success: true, message: "Login successful" });
});

/*Starts the server on port 5000.
Prints a message in the console when the server is running */
app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user to the database
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
      return res.status(400).json({ error: message });
    }
    res.status(400).json({ error: error.message });
  }
};

// Verify user and generate access token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res
      .status(200)
      .json({ token, id: user._id, username: user.username, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Register a new user to the database
exports.register = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
      res.status(400);
      throw new Error(message);
    }
    throw error;
  }
});

// Verify user and generate access token
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user._id, username: user.username, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res
    .status(200)
    .json({ token, id: user._id, username: user.username, isAdmin: user.isAdmin });
});

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.register = async (userData) => {
  const existingUsername = await User.findOne({ username: userData.username });
  if (existingUsername) throw new Error("Username already exists");

  const existingEmail = await User.findOne({ email: userData.email });
  if (existingEmail) throw new Error("Email already exists");

  const user = new User({
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });

  await user.save();
};

exports.login = async (userData) => {
  const user = await User.findOne({
    $or: [{ username: userData.username }, { email: userData.username }],
  });

  if (!user) throw new Error("Invalid username or password");

  const isMatch = await bcrypt.compare(userData.password, user.password);
  if (!isMatch) throw new Error("Invalid username or password");

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "90d" }
  );

  return {
    token,
  };
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

exports.findByEmail = async (email) => {
  return await User.findOne({ email });
};

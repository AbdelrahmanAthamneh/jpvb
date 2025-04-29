const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const vocabularySchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
  },
  wordTranslated: {
    type: String,
    trim: true,
  },
  meaning: {
    type: String,
    trim: true,
  },
  meaningTranslated: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  vocabulary: [vocabularySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;

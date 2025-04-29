const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    console.log("Connected to mongodb successfully!");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

module.exports = connectToDatabase;

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const vocabularyRoutes = require("./routes/vocabulary.routes");
const connectToDatabase = require("./db/db");

const app = express();

console.log("Environment Variables:", process.env);

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/vocabulary", vocabularyRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

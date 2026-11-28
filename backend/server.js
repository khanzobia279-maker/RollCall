const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});
// Student Routes
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/auth", require("./routes/authRoute"));
// Home Route
app.get("/", (req, res) => {
  res.send("RollCall API is Running");
});

// Start Server
const PORT = process.env.PORT || 5000;

module.exports = app;

if (require.main === module) {
  app.listen(process.env.PORT || 5000, () => console.log("Server running"));
}
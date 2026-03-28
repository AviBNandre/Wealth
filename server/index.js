const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware - Updated CORS to allow frontend URL
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     credentials: true,
//   }),
// );


app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://split-mate-chi.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/owed", require("./routes/owedRoutes"));
app.use("/api/recurring", require("./routes/recurringRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("SplitMate API is running and connected to MongoDB!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Please add a description"],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "Please add an amount"],
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    default: "expense",
  },
  category: {
    type: String,
    default: "Other",
  },
  icon: {
    type: String,
    default: "📦",
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);

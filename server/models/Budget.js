const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Food",
      "Transport",
      "Bills",
      "Entertainment",
      "Health",
      "Shopping",
      "Other",
      "Monthly", // Added "Monthly" to the enum
    ],
  },
  limit: {
    type: Number,
    required: true,
  },
  spent: {
    type: Number,
    default: 0,
  },
  month: {
    type: String,
    required: true,
    default: () => {
      const date = new Date();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Budget", BudgetSchema);

const mongoose = require("mongoose");

const RecurringSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Bills", "Subscriptions", "Rent", "Insurance", "Loans", "Other"],
  },
  frequency: {
    type: String,
    required: true,
    enum: ["Weekly", "Monthly", "Quarterly", "Yearly"],
  },
  nextDue: {
    type: Date,
    required: true,
  },
  icon: {
    type: String,
    default: "🔄",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recurring", RecurringSchema);

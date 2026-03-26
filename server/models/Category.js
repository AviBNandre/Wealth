const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    default: null,
  },
  color: {
    type: String,
    default: "#3B82F6",
  },
  icon: {
    type: String,
    default: "📦",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Category", CategorySchema);

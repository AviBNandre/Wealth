const express = require("express");
const router = express.Router();
const {
  createGroup,
  getUserGroups,
} = require("../controllers/groupController");
const { protect } = require("../middleware/authMiddleware");

// Both routes are protected - user must be logged in
router.post("/", protect, createGroup);
router.get("/", protect, getUserGroups);

module.exports = router;

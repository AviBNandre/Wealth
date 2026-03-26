const express = require("express");
const router = express.Router();
const {
  getBudgets,
  createOrUpdateBudget,
  deleteBudget,
  getMonthlyLimit,
  updateMonthlyLimit,
} = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Budget CRUD
router.get("/", getBudgets);
router.post("/", createOrUpdateBudget);
router.delete("/:id", deleteBudget);

// Monthly limit endpoints
router.get("/limit", getMonthlyLimit);
router.put("/limit", updateMonthlyLimit);

module.exports = router;

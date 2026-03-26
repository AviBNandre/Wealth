const express = require("express");
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addToGoal,
} = require("../controllers/goalController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // All routes require authentication

router.get("/", getGoals);
router.post("/", createGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);
router.post("/:id/add", addToGoal);

module.exports = router;

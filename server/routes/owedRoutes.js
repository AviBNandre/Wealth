const express = require("express");
const router = express.Router();
const {
  getOwed,
  createOwed,
  settleOwed,
  deleteOwed,
} = require("../controllers/owedController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // All routes require authentication

router.get("/", getOwed);
router.post("/", createOwed);
router.put("/:id/settle", settleOwed);
router.delete("/:id", deleteOwed);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getCategories);
router.post("/", createCategory);
router.delete("/:name", deleteCategory);

module.exports = router;

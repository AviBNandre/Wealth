const Budget = require("../models/Budget");

// @desc    Get all budgets for user (excluding the Monthly meta budget)
// @route   GET /api/budgets
exports.getBudgets = async (req, res) => {
  try {
    const currentMonth = new Date();
    const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;

    const budgets = await Budget.find({
      userId: req.user.id,
      month: monthKey,
      category: { $ne: "Monthly" }, // Exclude the Monthly meta budget
    });

    res.status(200).json(budgets);
  } catch (error) {
    console.error("Error in getBudgets:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update budget
// @route   POST /api/budgets
exports.createOrUpdateBudget = async (req, res) => {
  try {
    const { category, limit, spent } = req.body;
    const currentMonth = new Date();
    const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;

    let budget = await Budget.findOne({
      userId: req.user.id,
      category,
      month: monthKey,
    });

    if (budget) {
      budget.limit = limit || budget.limit;
      budget.spent = spent || budget.spent;
      await budget.save();
    } else {
      budget = await Budget.create({
        userId: req.user.id,
        category,
        limit,
        spent: spent || 0,
        month: monthKey,
      });
    }

    res.status(200).json(budget);
  } catch (error) {
    console.error("Error in createOrUpdateBudget:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
exports.deleteBudget = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Budget deleted" });
  } catch (error) {
    console.error("Error in deleteBudget:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly limit (from Monthly category budget)
// @route   GET /api/budgets/limit
exports.getMonthlyLimit = async (req, res) => {
  try {
    const currentMonth = new Date();
    const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;

    // Look for the Monthly category budget
    let monthlyBudget = await Budget.findOne({
      userId: req.user.id,
      category: "Monthly",
      month: monthKey,
    });

    // If no Monthly budget exists, create one with default 20000
    if (!monthlyBudget) {
      monthlyBudget = await Budget.create({
        userId: req.user.id,
        category: "Monthly",
        limit: 20000,
        spent: 0,
        month: monthKey,
      });
    }

    res.status(200).json({ limit: monthlyBudget.limit });
  } catch (error) {
    console.error("Error in getMonthlyLimit:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update monthly limit (update Monthly category budget)
// @route   PUT /api/budgets/limit
exports.updateMonthlyLimit = async (req, res) => {
  try {
    const { limit } = req.body;

    if (!limit || limit <= 0) {
      return res
        .status(400)
        .json({ message: "Please provide a valid limit amount" });
    }

    const currentMonth = new Date();
    const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;

    let monthlyBudget = await Budget.findOne({
      userId: req.user.id,
      category: "Monthly",
      month: monthKey,
    });

    if (monthlyBudget) {
      monthlyBudget.limit = limit;
      await monthlyBudget.save();
    } else {
      monthlyBudget = await Budget.create({
        userId: req.user.id,
        category: "Monthly",
        limit,
        spent: 0,
        month: monthKey,
      });
    }

    res.status(200).json({
      limit: monthlyBudget.limit,
      message: "Budget limit updated successfully",
    });
  } catch (error) {
    console.error("Error in updateMonthlyLimit:", error);
    res.status(500).json({ message: error.message });
  }
};

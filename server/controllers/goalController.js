const Goal = require("../models/Goal");

// @desc    Get all goals for user
// @route   GET /api/goals
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a goal
// @route   POST /api/goals
exports.createGoal = async (req, res) => {
  try {
    const { name, target, saved, deadline, priority, icon } = req.body;
    const goal = await Goal.create({
      userId: req.user.id,
      name,
      target,
      saved: saved || 0,
      deadline,
      priority,
      icon,
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
exports.updateGoal = async (req, res) => {
  try {
    const { saved, archived } = req.body;
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (saved !== undefined) goal.saved = saved;
    if (archived !== undefined) goal.archived = archived;

    await goal.save();
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await goal.deleteOne();
    res.status(200).json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add money to goal
// @route   POST /api/goals/:id/add
exports.addToGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const newSaved = Math.min(goal.saved + amount, goal.target);
    goal.saved = newSaved;
    await goal.save();

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

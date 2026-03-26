const Expense = require("../models/Expense");

// @desc    Add a new expense (Personal)
// @route   POST /api/expenses
exports.addExpense = async (req, res) => {
  try {
    const { description, amount, category, date, icon } = req.body;

    const expense = await Expense.create({
      description,
      amount: Math.abs(amount), // Store as positive number
      type: "expense",
      paidBy: req.user.id,
      category,
      date: date || Date.now(),
      icon,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all personal transactions for the logged-in user
// @route   GET /api/expenses
exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Expense.find({
      paidBy: req.user.id,
      type: "expense",
    }).sort({ date: -1 });

    // Format for frontend compatibility
    const formatted = transactions.map((tx) => ({
      id: tx._id,
      name: tx.description,
      category: tx.category || "Other",
      amount: -tx.amount,
      date: new Date(tx.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      rawDate: tx.date,
      icon: tx.icon || "📦",
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.paidBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard summary
// @route   GET /api/expenses/summary
exports.getSummary = async (req, res) => {
  try {
    const transactions = await Expense.find({
      paidBy: req.user.id,
      type: "expense",
    });

    let totalExpense = 0;
    transactions.forEach((item) => {
      totalExpense += item.amount;
    });

    res.status(200).json({
      totalExpense,
      transactionCount: transactions.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

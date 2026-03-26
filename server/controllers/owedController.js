const Owed = require("../models/Owed");

// @desc    Get all owed amounts for user
// @route   GET /api/owed
exports.getOwed = async (req, res) => {
  try {
    const owed = await Owed.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(owed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create owed entry
// @route   POST /api/owed
exports.createOwed = async (req, res) => {
  try {
    const { name, amount, description } = req.body;
    const owed = await Owed.create({
      userId: req.user.id,
      name,
      amount,
      description,
    });
    res.status(201).json(owed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark as settled
// @route   PUT /api/owed/:id/settle
exports.settleOwed = async (req, res) => {
  try {
    const owed = await Owed.findById(req.params.id);

    if (!owed) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (owed.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    owed.settled = true;
    await owed.save();
    res.status(200).json(owed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete owed entry
// @route   DELETE /api/owed/:id
exports.deleteOwed = async (req, res) => {
  try {
    const owed = await Owed.findById(req.params.id);

    if (!owed) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (owed.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await owed.deleteOne();
    res.status(200).json({ message: "Entry deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

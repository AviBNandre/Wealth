const Recurring = require("../models/Recurring");

exports.getRecurring = async (req, res) => {
  try {
    const recurring = await Recurring.find({ userId: req.user.id }).sort({
      nextDue: 1,
    });
    res.status(200).json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRecurring = async (req, res) => {
  try {
    const { name, amount, category, frequency, nextDue, icon } = req.body;
    const recurring = await Recurring.create({
      userId: req.user.id,
      name,
      amount,
      category,
      frequency,
      nextDue,
      icon,
    });
    res.status(201).json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRecurring = async (req, res) => {
  try {
    const recurring = await Recurring.findById(req.params.id);
    if (!recurring) return res.status(404).json({ message: "Not found" });
    if (recurring.userId.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    Object.assign(recurring, req.body);
    await recurring.save();
    res.status(200).json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRecurring = async (req, res) => {
  try {
    const recurring = await Recurring.findById(req.params.id);
    if (!recurring) return res.status(404).json({ message: "Not found" });
    if (recurring.userId.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    await recurring.deleteOne();
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Group = require("../models/Group");

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    // Ensure the creator is included in members and set as admin
    const groupMembers = members ? [...members, req.user.id] : [req.user.id];

    const group = await Group.create({
      name,
      description,
      members: groupMembers,
      admin: req.user.id,
    });

    res.status(201).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all groups for the logged-in user
exports.getUserGroups = async (req, res) => {
  try {
    // Find groups where the current user's ID is in the members array
    const groups = await Group.find({ members: req.user.id }).populate(
      "members",
      "name email",
    );

    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// backend/src/controllers/user.controller.js
const userService = require("../services/user.service");

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    await userService.createUser(req.body, req.user);
    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(err.message.includes("Forbidden") ? 403 : 500).json({ message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    await userService.updateUserRole(req.params.id, role, req.user);
    res.json({ message: "User role updated successfully" });
  } catch (err) {
    res.status(err.message.includes("Forbidden") ? 403 : 500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id, req.user);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(err.message.includes("Forbidden") ? 403 : 500).json({ message: err.message });
  }
};
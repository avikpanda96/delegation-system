// backend/src/controllers/auth.controller.js
const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    await authService.register(req.body);
    res.json({ message: "registered" });
  } catch (e) {
    // FIX: Send the error message string instead of the raw error object
     const errorMessage = e.message || e.error || "Registration failed";
    res.status(400).json({ error: errorMessage || "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    // Logic remains: returning token as an object
    res.json({ token });
  } catch (e) {
    // FIX: Send the error message so the frontend knows why login failed (e.g., "Invalid credentials")
    res.status(400).json({ error: e.message || "Login failed" });
  }
};

exports.me = async (req, res) => {
  try {
    // req.user is set in auth.middleware from JWT
    const user = req.user;
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get user info" });
  }
};

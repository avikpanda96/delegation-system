// backend/src/routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// All routes require authentication
router.use(auth);

// Superadmin & admin can view users
router.get("/", role(["superadmin","admin"]), userController.getUsers);

// Create user: Superadmin can create Admin/User, Admin can create User
router.post("/", role(["superadmin","admin"]), userController.createUser);

// Update role: Superadmin only
router.put("/:id", role(["superadmin"]), userController.updateUserRole);

// Delete user: Superadmin only
router.delete("/:id", role(["superadmin"]), userController.deleteUser);

module.exports = router;
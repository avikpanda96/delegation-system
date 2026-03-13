const express = require("express");
const router = express.Router();
const delegationController = require("../controllers/delegation.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Super Admin: view all & delete
router.get("/", auth, role(["superadmin", "admin"]), delegationController.getAll);
router.post("/", auth, role(["admin"]), delegationController.create);
router.put("/:id", auth, role(["admin", "user"]), delegationController.updateStatus);
router.delete("/:id", auth, role(["superadmin"]), delegationController.deleteDelegation);

module.exports = router;
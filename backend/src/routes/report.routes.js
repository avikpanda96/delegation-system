const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// Super Admin: all reports
// Admin: reports of their delegations
// User: only own delegations
router.get("/", auth, reportController.getReports);

module.exports = router;
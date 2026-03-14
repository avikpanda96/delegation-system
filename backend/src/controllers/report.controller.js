
const reportService = require("../services/report.service");

exports.getReports = async (req, res) => {
  try {
    const user = req.user; // user info from JWT middleware
    let reports;

    if(user.role === "superadmin"){
      // Super Admin sees all delegations / reports
      reports = await reportService.getAllReports();
    } else if(user.role === "admin"){
      // Admin sees only reports of delegations they created
      reports = await reportService.getAdminReports(user.id);
    } else {
      // Normal user sees only their assigned delegations / reports
      reports = await reportService.getUserReports(user.id);
    }

    res.json(reports);
  } catch(err){
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};
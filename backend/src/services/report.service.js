
const db = require("../config/db");

/**
 * Super Admin: get all delegations grouped by status
 */
exports.getAllReports = async () => {
  const [rows] = await db.query(`
    SELECT status, COUNT(*) as total 
    FROM delegations 
    GROUP BY status
  `);
  return rows;
};

/**
 * Admin: get only delegations created by this admin, grouped by status
 * @param {number} adminId - id of admin user
 */
exports.getAdminReports = async (adminId) => {
  const [rows] = await db.query(`
    SELECT status, COUNT(*) as total 
    FROM delegations 
    WHERE created_by = ? 
    GROUP BY status
  `, [adminId]);
  return rows;
};

/**
 * User: get only delegations assigned to this user, grouped by status
 * @param {number} userId - id of normal user
 */
exports.getUserReports = async (userId) => {
  const [rows] = await db.query(`
    SELECT status, COUNT(*) as total 
    FROM delegations 
    WHERE assigned_to = ? 
    GROUP BY status
  `, [userId]);
  return rows;
};
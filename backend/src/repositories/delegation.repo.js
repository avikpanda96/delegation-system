// backend/src/repositories/delegation.repo.js
const db = require("../config/db");

exports.getAll = async () => {
  const [rows] = await db.query("SELECT * FROM delegations");
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM delegations WHERE id=?", [id]);
  return rows[0];
};

exports.getByUser = async (userId) => {
  const [rows] = await db.query("SELECT * FROM delegations WHERE assigned_to=?", [userId]);
  return rows;
};

exports.create = async (data) => {
  await db.query(
    `INSERT INTO delegations
    (title, description, assigned_to, created_by, status)
    VALUES (?,?,?,?,?)`,
    [data.title, data.description, data.assigned_to, data.created_by, data.status]
  );
  return { id: result.insertId, ...data }; 
};

exports.updateStatus = async (id, status) => {
  await db.query(
    "UPDATE delegations SET status=? WHERE id=?",
    [status, id]
  );
};

// 🔹 ADD THIS DELETE FUNCTION
exports.delete = async (id) => {
  await db.query("DELETE FROM delegations WHERE id=?", [id]);
};
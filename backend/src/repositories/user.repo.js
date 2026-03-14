// backend/src/repositories/user.repo.js
const db = require("../config/db");

exports.findByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email]);
  return rows[0]; // returns single user or undefined
};

exports.getAll = async () => {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id=?", [id]);
  return rows[0];
};

exports.create = async (data) => {
  await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
    [data.name, data.email, data.password, data.role]
  );
};

exports.updateRole = async (id, role) => {
  await db.query("UPDATE users SET role=? WHERE id=?", [role, id]);
};

exports.delete = async (id) => {
  await db.query("DELETE FROM users WHERE id=?", [id]);
};
const db = require("../config/db");

exports.addLog = async (userId, action) => {
  await db.query(
    "INSERT INTO activity_logs(user_id, action) VALUES (?,?)",
    [userId, action]
  );
};
// backend/src/services/user.service.js
const repo = require("../repositories/user.repo");
const logRepo = require("../repositories/log.repo");
const { hashPassword } = require("../utils/hash");

exports.getAllUsers = async () => {
  return await repo.getAll();
};

exports.createUser = async (data, user) => {
  if (user.role !== "superadmin" && user.role !== "admin") {
    throw new Error("Forbidden: Insufficient role");
  }

  // Admin can create only User, Superadmin can create Admin/User
  if (user.role === "admin" && data.role !== "user") {
    throw new Error("Forbidden: Admin can only create Users");
  }

  data.password = await hashPassword(data.password);
  await repo.create(data);

  await logRepo.addLog(user.id, `Created user: ${data.name} (${data.role})`);
};

exports.updateUserRole = async (id, role, user) => {
  if (user.role !== "superadmin") {
    throw new Error("Forbidden: Only Superadmin can update roles");
  }

  await repo.updateRole(id, role);
  await logRepo.addLog(user.id, `Updated role of user ${id} to ${role}`);
};

exports.deleteUser = async (id, user) => {
  if (user.role !== "superadmin") {
    throw new Error("Forbidden: Only Superadmin can delete users");
  }

  await repo.delete(id);
  await logRepo.addLog(user.id, `Deleted user with id ${id}`);
};
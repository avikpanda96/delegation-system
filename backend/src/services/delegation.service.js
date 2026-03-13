// backend/src/services/delegation.service.js
const repo = require("../repositories/delegation.repo");
const logRepo = require("../repositories/log.repo");

// GET all delegations (RBAC-aware)
exports.getAll = async (user) => {
  if (user.role === "superadmin" || user.role === "admin") {
    return await repo.getAll();
  } else {
    return await repo.getByUser(user.id); // normal user sees only assigned
  }
};

// CREATE delegation
exports.create = async (data, user) => {
  if (user.role !== "admin") {
    throw new Error("Forbidden: Insufficient role");
  }

  const delegation = {
    ...data,
    created_by: user.id,
    status: "pending",
  };

  const created = await repo.create(delegation);

  await logRepo.addLog(user.id, `Created delegation: ${delegation.title}`);

  return created;
};

// UPDATE status
exports.updateStatus = async (id, status, user) => {
  const delegation = await repo.getById(id);
  if (!delegation) throw new Error("Delegation not found");

  // normal users can update only their own delegations
  if (user.role === "user" && delegation.assigned_to !== user.id) {
    throw new Error("Forbidden: Insufficient role");
  }

  await repo.updateStatus(id, status);

  await logRepo.addLog(user.id, `Updated delegation status to ${status}`);

  return { id, status };
};

// DELETE delegation (Super Admin only)
exports.deleteDelegation = async (id, user) => {
  if (user.role !== "superadmin") {
    throw new Error("Forbidden: Insufficient role");
  }

  await repo.delete(id);
  await logRepo.addLog(user.id, `Deleted delegation ID ${id}`);

  return { message: "Deleted successfully" };
};
// backend/src/controllers/delegation.controller.js
const delegationService = require("../services/delegation.service");

exports.getAll = async (req, res) => {
  try {
    const delegations = await delegationService.getAll(req.user);
    res.json(delegations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const delegation = await delegationService.create(req.body, req.user);
    res.json(delegation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await delegationService.updateStatus(req.params.id, status, req.user);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDelegation = async (req, res) => {
  try {
    const deleted = await delegationService.deleteDelegation(req.params.id, req.user);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
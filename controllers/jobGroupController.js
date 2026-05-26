const jobGroupService = require('../services/jobGroupService');

exports.getAll = async (req, res) => {
  try {
    const data = await jobGroupService.getAllJobGroups();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await jobGroupService.getJobGroupById(req.params.id);
    if (!data) return res.status(404).json({ message: "JobGroup not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await jobGroupService.createJobGroup(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await jobGroupService.updateJobGroup(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: "JobGroup not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await jobGroupService.deleteJobGroup(req.params.id);
    if (!deleted) return res.status(404).json({ message: "JobGroup not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

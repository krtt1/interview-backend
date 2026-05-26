const jobTitleService = require('../services/jobTitleService');
const { mockJobTitles } = require('../utils/mockData');

exports.getAll = async (req, res) => {
  try {
    const data = await jobTitleService.getAllJobTitles();
    res.json(data);
  } catch (error) {
    console.error('❌ [JobTitle.getAll] Error:', error.message);
    // Return mock data if database fails
    res.json(mockJobTitles);
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await jobTitleService.getJobTitleById(req.params.id);
    if (!data) return res.status(404).json({ message: "JobTitle not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await jobTitleService.createJobTitle(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await jobTitleService.updateJobTitle(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: "JobTitle not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await jobTitleService.deleteJobTitle(req.params.id);
    if (!deleted) return res.status(404).json({ message: "JobTitle not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

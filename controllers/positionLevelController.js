const positionLevelService = require('../services/positionLevelService');
const { mockPositionLevels } = require('../utils/mockData');

exports.getAll = async (req, res) => {
  try {
    console.log('📋 [PositionLevel.getAll] Starting...');
    const data = await positionLevelService.getAllPositionLevels();
    console.log(`✅ [PositionLevel.getAll] Found ${data.length} records`);
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ [PositionLevel.getAll] Error:', error.message);
    // Return mock data if database fails
    res.status(200).json(mockPositionLevels);
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await positionLevelService.getPositionLevelById(req.params.id);
    if (!data) return res.status(404).json({ message: "PositionLevel not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await positionLevelService.createPositionLevel(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await positionLevelService.updatePositionLevel(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: "PositionLevel not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await positionLevelService.deletePositionLevel(req.params.id);
    if (!deleted) return res.status(404).json({ message: "PositionLevel not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

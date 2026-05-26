const positionTypeService = require('../services/positionTypeService');

exports.getAll = async (req, res) => {
  try {
    const data = await positionTypeService.getAllPositionTypes();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await positionTypeService.getPositionTypeById(req.params.id);
    if (!data) return res.status(404).json({ message: "PositionType not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await positionTypeService.createPositionType(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await positionTypeService.updatePositionType(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: "PositionType not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await positionTypeService.deletePositionType(req.params.id);
    if (!deleted) return res.status(404).json({ message: "PositionType not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const PositionLevel = require('../models/positionLevel');

exports.getAllPositionLevels = async () => {
  return await PositionLevel.findAll();
};

exports.getPositionLevelById = async (id) => {
  return await PositionLevel.findByPk(id);
};

exports.createPositionLevel = async (data) => {
  return await PositionLevel.create(data);
};

exports.updatePositionLevel = async (id, data) => {
  const positionLevel = await PositionLevel.findByPk(id);
  if (!positionLevel) return null;
  await positionLevel.update(data);
  return positionLevel;
};

exports.deletePositionLevel = async (id) => {
  const positionLevel = await PositionLevel.findByPk(id);
  if (!positionLevel) return null;
  await positionLevel.destroy();
  return positionLevel;
};

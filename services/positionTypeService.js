const PositionType = require('../models/positionType');

exports.getAllPositionTypes = async () => {
  return await PositionType.findAll();
};

exports.getPositionTypeById = async (id) => {
  return await PositionType.findByPk(id);
};

exports.createPositionType = async (data) => {
  return await PositionType.create(data);
};

exports.updatePositionType = async (id, data) => {
  const positionType = await PositionType.findByPk(id);
  if (!positionType) return null;
  await positionType.update(data);
  return positionType;
};

exports.deletePositionType = async (id) => {
  const positionType = await PositionType.findByPk(id);
  if (!positionType) return null;
  await positionType.destroy();
  return positionType;
};

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PositionLevel = sequelize.define('position_level', {

  position_level_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },

  position_level_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  }

}, {
  tableName: 'tb_position_level',
  timestamps: false,
  underscored: true
});

module.exports = PositionLevel;

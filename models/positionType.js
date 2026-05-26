const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PositionType = sequelize.define('position_type', {

  position_type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },

  position_type_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  }

}, {
  tableName: 'tb_position_type',
  timestamps: false,
  underscored: true
});

module.exports = PositionType;

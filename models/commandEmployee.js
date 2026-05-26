const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommandEmployee = sequelize.define(
  'command_employee',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    command_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'command',
        key: 'command_id'
      }
    },
    employee_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      references: {
        model: 'tb_employee',
        key: 'id'
      }
    },
    command_job: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    command_file: {
      type: DataTypes.STRING(255)
    }
  },
  {
    tableName: 'command_employee',
    timestamps: false
  }
);

module.exports = CommandEmployee;

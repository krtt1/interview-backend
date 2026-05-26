const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Command = sequelize.define(
  'command',
  {
    command_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    command_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    command_detail: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT
    }
  },
  {
    tableName: 'command',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);

module.exports = Command;

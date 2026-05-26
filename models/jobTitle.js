const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobTitle = sequelize.define('tb_job_title', {

  job_title_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },

  job_title_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  }

}, {
  tableName: 'tb_job_title',
  timestamps: false,
  underscored: true
});

module.exports = JobTitle;

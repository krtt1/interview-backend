const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobGroup = sequelize.define('job_group', {

  job_group_id: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  job_group_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  }

}, {
  tableName: 'tb_job_group',
  timestamps: false,
  underscored: true
});

module.exports = JobGroup;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ตารางสำหรับเก็บประสบการณ์อื่นๆ (เลือกได้มากกว่า 1 ข้อ)
const CapacityOtherExperiences = sequelize.define('tb_capacity_other_experiences', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  employee_id: {
    type: DataTypes.STRING(13),
    allowNull: false,
    references: {
      model: 'tb_employee',
      key: 'id'
    }
  },
  experience_name: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'ชื่อประสบการณ์/หลักสูตรอื่นๆ'
  }
}, {
  tableName: 'tb_capacity_other_experiences',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

module.exports = CapacityOtherExperiences;

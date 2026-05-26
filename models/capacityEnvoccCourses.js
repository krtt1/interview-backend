const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ตารางสำหรับเก็บหลักสูตร EnvOcc (เลือกได้มากกว่า 1 ข้อ)
const CapacityEnvoccCourses = sequelize.define('tb_capacity_envocc_courses', {
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
  course_name: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'ชื่อหลักสูตร EnvOcc'
  }
}, {
  tableName: 'tb_capacity_envocc_courses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

module.exports = CapacityEnvoccCourses;

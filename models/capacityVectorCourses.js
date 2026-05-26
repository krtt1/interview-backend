const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ตารางสำหรับเก็บหลักสูตรโรคติดต่อนำโดยแมลง (เลือกได้มากกว่า 1 ข้อ)
const CapacityVectorCourses = sequelize.define('tb_capacity_vector_courses', {
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
    comment: 'ชื่อหลักสูตรโรคติดต่อนำโดยแมลง'
  }
}, {
  tableName: 'tb_capacity_vector_courses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

module.exports = CapacityVectorCourses;

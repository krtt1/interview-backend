const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployeeJobHistory = sequelize.define('job_history', {
  history_id: {
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
  job_group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tb_job_group',
      key: 'job_group_id'
    }
  },
  position_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tb_position_type',
      key: 'position_type_id'
    }
  },
  position_level_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tb_position_level',
      key: 'position_level_id'
    }
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'วันที่เริ่มตำแหน่ง (NULL = ยังไม่ทราบวันเริ่ม)'
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'วันที่สิ้นสุดตำแหน่ง (NULL = ตำแหน่งปัจจุบัน)'
  }
}, {
  tableName: 'job_history',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['employee_id'],
      where: {
        end_date: null
      },
      name: 'unique_active_job_per_employee'
    }
  ]
});

module.exports = EmployeeJobHistory;

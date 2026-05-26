const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MeetingEmployee = sequelize.define('tb_meeting_employee', {

  id: { // ลำดับในตารางกลาง
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },

  meeting_id: { // FK ไป tb_meeting.meeting_id
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tb_meeting',
      key: 'meeting_id'
    }
  },

  employee_id: { // FK ไป tb_employee.id
    type: DataTypes.STRING(13),
    allowNull: false,
    references: {
      model: 'tb_employee',
      key: 'id'
    }
  },

  // รายบุคคล: ไฟล์ที่แต่ละคนแนบ
  attachment_file: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  // วันที่ส่งไฟล์ของแต่ละคน
  submit_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },

  // สถานะการติดตามระดับคน (default: อยู่ระหว่างติดตาม)
  tracking_status: {
    type: DataTypes.ENUM('อยู่ระหว่างติดตาม', 'ส่งแล้ว', 'เกินกำหนด'),
    allowNull: false,
    defaultValue: 'อยู่ระหว่างติดตาม'
  }

}, {
  tableName: 'tb_meeting_employee',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['meeting_id', 'employee_id']
    }
  ]
});

module.exports = MeetingEmployee;

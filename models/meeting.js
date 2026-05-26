const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meeting = sequelize.define('tb_meeting', {

  meeting_id: { // ลำดับ
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },

  start_date: { // ตั้งแต่วันที่
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  end_date: { // ถึงวันที่ (ใช้เป็น deadline สำหรับส่งรายงาน)
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  topic: { // หัวข้อ
    type: DataTypes.STRING(255),
    allowNull: false
  },

  meeting_title: { // ชื่อประชุม
    type: DataTypes.STRING(255),
    allowNull: false
  },

  organizer: { // ผู้จัดประชุม
    type: DataTypes.STRING(255),
    allowNull: false
  },

  location: { // สถานที่จัดประชุม
    type: DataTypes.STRING(255),
    allowNull: true
  },

  meeting_type: { // รูปแบบการจัดประชุม -Onsite -Online
    type: DataTypes.ENUM('Onsite', 'Online'),
    allowNull: false
  },

  budget_source: { // แหล่งงบ
    type: DataTypes.STRING(255),
    allowNull: true
  },

  note: { // หมายเหตุ
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {
  tableName: 'tb_meeting',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

module.exports = Meeting;

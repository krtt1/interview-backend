const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('tb_employee', {

  id: { 
    type: DataTypes.STRING(13),
    primaryKey: true,
    allowNull: false
  },
  password: { 
    type: DataTypes.STRING(64),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  prefix_th: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  first_name_th: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  last_name_th: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('ชาย', 'หญิง'),
    allowNull: false
  },
  birt_date: { // YYYY-MM-DD
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  job_title_id: { // ประเภทบุคลากร
    type: DataTypes.INTEGER,
    allowNull: true
  },
  position_level_id: { // ระดับตำแหน่ง
    type: DataTypes.INTEGER,
    allowNull: true
  },
  position_type_id: { // ตำแหน่งในสายงาน
    type: DataTypes.INTEGER,
    allowNull: true
  },
  job_group_id: { // กลุ่มงาน
    type: DataTypes.INTEGER,
    allowNull: true
  },
  education_level: { //ระดับการศึกษา
    type: DataTypes.TEXT,
    allowNull: true
  },
  degree_name: { //วุฒิการศึกษา
    type: DataTypes.TEXT,
    allowNull: true
  },
  institution_name: { //สถาบันการศึกษา
    type: DataTypes.TEXT,
    allowNull: true
  },
 graduation_year: { // ปีที่สำเร็จการศึกษา
    type: DataTypes.INTEGER,
    allowNull: true
  },
  degree_for_employment: { //วุฒิการศึกษาที่ใช้บรรจุ
    type: DataTypes.TEXT,
    allowNull: true
  },
  highest_degree: { //วุฒิการศึกษาสูงสุด
    type: DataTypes.TEXT,
    allowNull: true
  },
  professional_license_degree: { //วุฒิการศึกษาที่เป็นใบประกอบวิชาชีพ
    type: DataTypes.TEXT,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('superadmin', 'admin', 'user'),
    allowNull: false,
    defaultValue: 'user'
  },
  work_status: {
    type: DataTypes.ENUM('ปฏิบัติหน้าที่', 'หมดสัญญา', 'โอนย้าย', 'ลาออก', 'เสียชีวิต'),
    allowNull: false,
    defaultValue: 'ปฏิบัติหน้าที่'
  },
  profile_image: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'เก็บ path ของรูปโปรไฟล์'
  }

}, {
  tableName: 'tb_employee',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

module.exports = Employee;

const bcrypt = require('bcrypt');
require('dotenv').config();
const sequelize = require('../config/database');
const Employee = require('../models/employee');

async function createUser() {
  try {
    await sequelize.authenticate();
    console.log('✅ เชื่อมต่อ Database สำเร็จ');

    // ข้อมูล User ใหม่
    const newUser = {
      id: '1234567890005',
      password: 'password123', // จะ hash โดยอัตโนมัติ
      email: 'employee005@example.com',
      prefix_th: 'นาย',
      first_name_th: 'สมพร',
      last_name_th: 'ทดสอบ',
      gender: 'ชาย',
      birt_date: '1992-06-15',
      age: 32,
      phone_number: '0812345679',
      job_title_id: 1,
      position_level_id: 2,
      position_type_id: 1,
      job_group_id: 1,
      education_level: 'ปริญญาตรี',
      degree_name: 'วิทยาศาสตร์บัณฑิต',
      institution_name: 'มหาวิทยาลัยสมมุติ',
      graduation_year: 2014,
      role: 'user',
      work_status: 'ปฏิบัติหน้าที่'
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;

    // สร้าง User
    const user = await Employee.create(newUser);

    console.log('\n✅ สร้าง User สำเร็จ!');
    console.log('\n📋 ข้อมูล User ใหม่:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   ชื่อ: ${user.first_name_th} ${user.last_name_th}`);
    console.log(`   Role: ${user.role}`);
    console.log(`\n🔐 ข้อมูลเข้าสู่ระบบ:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Password: password123`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createUser();

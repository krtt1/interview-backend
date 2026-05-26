const bcrypt = require('bcrypt');
require('dotenv').config();
const sequelize = require('../config/database');
const { Employee } = require('../models');

async function createTestUser() {
  try {
    await sequelize.authenticate();
    console.log('✅ เชื่อมต่อ Database สำเร็จ');

    // ข้อมูล Test User
    const testUser = {
      id: '0123456789123',  // ID ที่ใช้ในการ login
      password: '1234',      // Password ที่ใช้ในการ login
      email: 'test@example.com',
      prefix_th: 'นาย',
      first_name_th: 'ทดสอบ',
      last_name_th: 'ระบบ',
      gender: 'ชาย',
      birt_date: '1990-01-01',
      age: 34,
      phone_number: '0812345678',
      job_title_id: 1,
      position_level_id: 1,
      position_type_id: 1,
      job_group_id: 1,
      education_level: 'ปริญญาตรี',
      degree_name: 'วิทยาศาสตร์บัณฑิต',
      institution_name: 'มหาวิทยาลัยทดสอบ',
      graduation_year: 2014,
      role: 'user',
      work_status: 'ปฏิบัติหน้าที่'
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    testUser.password = hashedPassword;

    // ตรวจสอบว่ามี user นี้อยู่แล้วหรือไม่
    const existing = await Employee.findByPk(testUser.id);
    if (existing) {
      console.log('⚠️ User นี้มีอยู่แล้ว ทำการ update...');
      await Employee.update(testUser, { where: { id: testUser.id } });
      console.log('✅ Update User สำเร็จ!');
    } else {
      // สร้าง User ใหม่
      await Employee.create(testUser);
      console.log('✅ สร้าง Test User สำเร็จ!');
    }

    console.log('\n📋 ข้อมูล Test User:');
    console.log(`   ID: ${testUser.id}`);
    console.log(`   Email: ${testUser.email}`);
    console.log(`   ชื่อ: ${testUser.first_name_th} ${testUser.last_name_th}`);
    console.log(`   Role: ${testUser.role}`);
    console.log(`\n🔐 ข้อมูลเข้าสู่ระบบ:`);
    console.log(`   ID: ${testUser.id}`);
    console.log(`   Password: ${testUser.password === hashedPassword ? '1234' : testUser.password}`);
    console.log(`\n✅ ลองเข้าสู่ระบบด้วย ID และ Password ข้างบน`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.parent) {
      console.error('Parent Error:', error.parent.message);
    }
    process.exit(1);
  }
}

createTestUser();

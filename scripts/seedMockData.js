/**
 * Mock Data Seeding Script
 * ============================================
 * สคริปต์นี้ใช้สำหรับสร้างข้อมูลสมมุติ (Mock Data) เพื่อ:
 * 1. ป้องกันการรั่วไหลข้อมูลส่วนบุคคล (PDPA Compliance)
 * 2. ทดสอบระบบด้วยข้อมูลที่ปลอดภัย
 * 3. Demo ให้คณะกรรมการโดยไม่เสี่ยงต่อการละเมิดกฎหมาย
 * 
 * วิธีใช้:
 * npm run seed:mock
 */

require('dotenv').config();
const sequelize = require('../config/database');
const {
  Employee,
  JobTitle,
  PositionLevel,
  PositionType,
  JobGroup
} = require('../models');
const bcrypt = require('bcrypt');

// ข้อมูลสมมุติ
const mockJobTitles = [
  { job_title_name: 'ข้าราชการ' },
  { job_title_name: 'พนักงานสัญญาจ้าง' },
  { job_title_name: 'ลูกจ้างชั่วคราว' }
];

const mockPositionLevels = [
  { position_level_name: 'ระดับ 1' },
  { position_level_name: 'ระดับ 2' },
  { position_level_name: 'ระดับ 3' },
  { position_level_name: 'ระดับ 4' },
  { position_level_name: 'ระดับ 5' }
];

const mockPositionTypes = [
  { position_type_name: 'ตำแหน่งบริหาร' },
  { position_type_name: 'ตำแหน่งวิชาการ' },
  { position_type_name: 'ตำแหน่งสนับสนุน' }
];

const mockJobGroups = [
  { job_group_name: 'กลุ่มบริหารทั่วไป' },
  { job_group_name: 'กลุ่มวิชาการ' },
  { job_group_name: 'กลุ่มเทคนิค' },
  { job_group_name: 'กลุ่มสนับสนุน' }
];

// ข้อมูลพนักงานสมมุติ (Anonymized)
const mockEmployees = [
  {
    id: '1234567890001',
    password: 'password123', // จะถูก hash
    email: 'employee001@example.com',
    prefix_th: 'นาย',
    first_name_th: 'สมชาย',
    last_name_th: 'ใจดี',
    gender: 'ชาย',
    birt_date: '1985-05-15',
    age: 39,
    phone_number: '0812345678',
    job_title_id: 1,
    position_level_id: 3,
    position_type_id: 2,
    job_group_id: 2,
    education_level: 'ปริญญาตรี',
    degree_name: 'วิทยาศาสตร์บัณฑิต',
    institution_name: 'มหาวิทยาลัยสมมุติ',
    graduation_year: 2007,
    degree_for_employment: 'วิทยาศาสตร์บัณฑิต',
    highest_degree: 'วิทยาศาสตร์มหาบัณฑิต',
    professional_license_degree: 'ใบประกอบวิชาชีพ',
    role: 'user',
    work_status: 'ปฏิบัติหน้าที่'
  },
  {
    id: '1234567890002',
    password: 'password123',
    email: 'employee002@example.com',
    prefix_th: 'นาง',
    first_name_th: 'สมหญิง',
    last_name_th: 'สุขสวัสดิ์',
    gender: 'หญิง',
    birt_date: '1990-08-20',
    age: 34,
    phone_number: '0898765432',
    job_title_id: 1,
    position_level_id: 2,
    position_type_id: 1,
    job_group_id: 1,
    education_level: 'ปริญญาตรี',
    degree_name: 'บริหารธุรกิจบัณฑิต',
    institution_name: 'มหาวิทยาลัยสมมุติ',
    graduation_year: 2012,
    degree_for_employment: 'บริหารธุรกิจบัณฑิต',
    highest_degree: 'บริหารธุรกิจมหาบัณฑิต',
    professional_license_degree: null,
    role: 'admin',
    work_status: 'ปฏิบัติหน้าที่'
  },
  {
    id: '1234567890003',
    password: 'password123',
    email: 'employee003@example.com',
    prefix_th: 'นาย',
    first_name_th: 'สมศักดิ์',
    last_name_th: 'เรียนรู้',
    gender: 'ชาย',
    birt_date: '1988-03-10',
    age: 36,
    phone_number: '0856789012',
    job_title_id: 2,
    position_level_id: 1,
    position_type_id: 3,
    job_group_id: 4,
    education_level: 'ปริญญาตรี',
    degree_name: 'วิศวกรรมศาสตร์บัณฑิต',
    institution_name: 'มหาวิทยาลัยสมมุติ',
    graduation_year: 2010,
    degree_for_employment: 'วิศวกรรมศาสตร์บัณฑิต',
    highest_degree: 'วิศวกรรมศาสตร์บัณฑิต',
    professional_license_degree: 'ใบประกอบวิชาชีพวิศวกร',
    role: 'user',
    work_status: 'ปฏิบัติหน้าที่'
  },
  {
    id: '1234567890004',
    password: 'password123',
    email: 'admin@example.com',
    prefix_th: 'นาย',
    first_name_th: 'สมบูรณ์',
    last_name_th: 'ผู้บริหาร',
    gender: 'ชาย',
    birt_date: '1980-01-01',
    age: 44,
    phone_number: '0834567890',
    job_title_id: 1,
    position_level_id: 5,
    position_type_id: 1,
    job_group_id: 1,
    education_level: 'ปริญญาเอก',
    degree_name: 'ปรัชญาดุษฎีบัณฑิต',
    institution_name: 'มหาวิทยาลัยสมมุติ',
    graduation_year: 2015,
    degree_for_employment: 'ปรัชญาดุษฎีบัณฑิต',
    highest_degree: 'ปรัชญาดุษฎีบัณฑิต',
    professional_license_degree: null,
    role: 'superadmin',
    work_status: 'ปฏิบัติหน้าที่'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 เริ่มสร้างข้อมูลสมมุติ...\n');

    // Sync database
    await sequelize.sync({ alter: true });
    console.log('✅ ตารางฐานข้อมูลพร้อมแล้ว\n');

    // Seed Job Titles
    console.log('📝 สร้างข้อมูล Job Titles...');
    const jobTitles = await JobTitle.bulkCreate(mockJobTitles, { ignoreDuplicates: true });
    console.log(`✅ สร้าง ${jobTitles.length} รายการ Job Title\n`);

    // Seed Position Levels
    console.log('📝 สร้างข้อมูล Position Levels...');
    const positionLevels = await PositionLevel.bulkCreate(mockPositionLevels, { ignoreDuplicates: true });
    console.log(`✅ สร้าง ${positionLevels.length} รายการ Position Level\n`);

    // Seed Position Types
    console.log('📝 สร้างข้อมูล Position Types...');
    const positionTypes = await PositionType.bulkCreate(mockPositionTypes, { ignoreDuplicates: true });
    console.log(`✅ สร้าง ${positionTypes.length} รายการ Position Type\n`);

    // Seed Job Groups
    console.log('📝 สร้างข้อมูล Job Groups...');
    const jobGroups = await JobGroup.bulkCreate(mockJobGroups, { ignoreDuplicates: true });
    console.log(`✅ สร้าง ${jobGroups.length} รายการ Job Group\n`);

    // Seed Employees with hashed passwords
    console.log('📝 สร้างข้อมูลพนักงาน (Anonymized)...');
    for (const emp of mockEmployees) {
      const hashedPassword = await bcrypt.hash(emp.password, 10);
      emp.password = hashedPassword;
    }

    const employees = await Employee.bulkCreate(mockEmployees, { ignoreDuplicates: true });
    console.log(`✅ สร้าง ${employees.length} รายการพนักงาน\n`);

    console.log('🎉 สร้างข้อมูลสมมุติเสร็จสิ้น!');
    console.log('\n📊 สรุปข้อมูล:');
    console.log(`   - Job Titles: ${jobTitles.length}`);
    console.log(`   - Position Levels: ${positionLevels.length}`);
    console.log(`   - Position Types: ${positionTypes.length}`);
    console.log(`   - Job Groups: ${jobGroups.length}`);
    console.log(`   - Employees: ${employees.length}`);
    console.log('\n🔐 ข้อมูลทั้งหมดเป็นข้อมูลสมมุติ (Mock Data) ปลอดภัยตามกฎหมาย PDPA');
    console.log('\n💡 ข้อมูลเข้าสู่ระบบตัวอย่าง:');
    console.log('   - ID: 1234567890001');
    console.log('   - Password: password123');
    console.log('   - Email: employee001@example.com');

    process.exit(0);
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  }
}

seedDatabase();

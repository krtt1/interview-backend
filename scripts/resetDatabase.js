/**
 * Reset Database Script
 * ลบฐานข้อมูลเก่าและสร้างใหม่
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function resetDatabase() {
  let connection;
  try {
    console.log('🔄 เชื่อมต่อ MySQL Server...');
    
    // เชื่อมต่อโดยไม่ระบุฐานข้อมูล
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3307,
      user: 'root',
      password: ''
    });

    console.log('✅ เชื่อมต่อสำเร็จ');

    // ลบฐานข้อมูลเก่า
    console.log('\n🗑️  ลบฐานข้อมูล odpc1 เก่า...');
    await connection.execute('DROP DATABASE IF EXISTS odpc1');
    console.log('✅ ลบฐานข้อมูลเก่าเสร็จ');

    // สร้างฐานข้อมูลใหม่
    console.log('\n📝 สร้างฐานข้อมูล odpc1 ใหม่...');
    await connection.execute(
      'CREATE DATABASE odpc1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
    );
    console.log('✅ สร้างฐานข้อมูลใหม่เสร็จ');

    console.log('\n🎉 Reset Database เสร็จสิ้น!');
    console.log('📊 ฐานข้อมูล: odpc1');
    console.log('🔤 Character Set: utf8mb4');
    console.log('🔤 Collation: utf8mb4_unicode_ci');

    process.exit(0);
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

resetDatabase();
